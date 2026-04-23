from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import requests

from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import TextLoader, WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings, HuggingFaceEndpoint, ChatHuggingFace

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage

# =========================
# 🔐 ENV
# =========================
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 📁 LOAD DATA
# =========================
loader1 = TextLoader("data/resume.txt")
loader2 = TextLoader("data/projects.txt")
loader3 = TextLoader("data/personal.txt")

docs = loader1.load() + loader2.load() + loader3.load()

portfolio_loader = WebBaseLoader("https://kanhaiya-kr-portfolio.vercel.app/")
docs.extend(portfolio_loader.load())

# =========================
# ✂️ SPLIT
# =========================
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(docs)

# =========================
# 🔎 EMBEDDINGS
# =========================
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

db = FAISS.from_documents(chunks, embeddings)

retriever = db.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 4, "fetch_k": 10}
)

# =========================
# 💬 MEMORY
# =========================
chat_history = []

def get_history():
    return "\n".join([msg.content for msg in chat_history[-6:]])

# =========================
# 🔧 TOOLS
# =========================
def rag_tool(question):
    docs = retriever.invoke(question)
    return "\n".join([d.page_content for d in docs])


def github_tool():
    try:
        url = "https://api.github.com/users/iamkanhaiyakumar/repos"
        headers = {"Authorization": f"Bearer {os.getenv('GITHUB_TOKEN')}"}

        res = requests.get(url, headers=headers, timeout=5)
        repos = res.json()

        repos = sorted(repos, key=lambda x: x.get("stargazers_count", 0), reverse=True)

        return {
            "total_projects": len(repos),
            "top_projects": [r["name"] for r in repos[:3]]
        }

    except:
        return {"total_projects": 0, "top_projects": []}


def portfolio_tool():
    try:
        loader = WebBaseLoader("https://kanhaiya-kr-portfolio.vercel.app/")
        docs = loader.load()
        return "\n".join([d.page_content for d in docs])
    except:
        return "Portfolio data not available"

# =========================
# 🤖 MODEL
# =========================
llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task="text-generation",
    huggingfacehub_api_token=os.getenv("HUGGINGFACEHUB_API_TOKEN")
)

chat_model = ChatHuggingFace(llm=llm)
parser = StrOutputParser()

# =========================
# 🧠 TOOL SELECTOR
# =========================
tool_selector_prompt = ChatPromptTemplate.from_template("""
You are a decision system.

Use conversation to understand context.

Rules:
- If question refers to previous topic → use same tool
- If about person, skills, projects → rag
- If about latest work → github
- If about website → portfolio

Return ONLY: rag OR github OR portfolio

Conversation:
{history}

Question: {question}
""")

# =========================
# 🧾 FINAL PROMPT
# =========================
answer_prompt = ChatPromptTemplate.from_template("""
You are Kanhaiya’s AI assistant.

STRICT RULES:
- Answer in 1–2 short sentences
- Be human-like and natural
- Understand follow-up questions
- Never say "not found"
- Never repeat answers
- Never mention source
- If question asks LIST of projects → use github
- If "any other" → give different info
- If no more → say: "That's all the major projects"
- NEVER say "not available" if info exists
- ALWAYS return links EXACTLY if asked
- If user asks for resume → return resume link
- If user asks for GitHub → return GitHub link
- If user asks for LinkedIn → return LinkedIn link
- Do NOT modify or shorten links

# 🔥 ADDED RULES (KEEP THESE)
- If question asks COUNT → use GitHub total_projects
- Always combine BOTH RAG and GitHub data
- Include 1–2 top project names in answers
- Always highlight top 3 projects if available

Conversation:
{history}

Data:
{data}

Question:
{question}

Answer:
""")

# =========================
# 📥 REQUEST
# =========================
class Query(BaseModel):
    question: str

# =========================
# 🌐 NORMAL CHAT API
# =========================
@app.post("/chat")
def chat(q: Query):
    try:
        history = get_history()

        # 🔗 structured quick responses
        if "resume" in q.question.lower():
            return {
                "type": "resume",
                "answer": "Here is his resume",
                "links": {
                    "resume": "https://kanhaiya-kr-portfolio.vercel.app/Kanhaiya-Kumar-Resume.pdf"
                }
            }

        # =========================
        # 🧠 TOOL SELECTION
        # =========================
        tool = (
            tool_selector_prompt
            | chat_model
            | parser
        ).invoke({
            "question": q.question,
            "history": history
        }).strip().lower()

        # =========================
        # 🔥 TOOL EXECUTION
        # =========================
        if tool == "github":
            data = github_tool()
        elif tool == "portfolio":
            data = portfolio_tool()
        else:
            data = rag_tool(q.question)

        # combine everything
        combined = f"""
{data}

Extra:
{rag_tool(q.question)}

GitHub Count:
{github_tool().get("total_projects")}
"""

        response = (
            answer_prompt
            | chat_model
            | parser
        ).invoke({
            "data": combined,
            "question": q.question,
            "history": history
        })

        chat_history.append(HumanMessage(content=q.question))
        chat_history.append(AIMessage(content=response))

        return {"type": "text", "answer": response.strip()}

    except Exception as e:
        return {"error": str(e)}

# =========================
# ⚡ STREAMING API
# =========================
def stream_text(text):
    for word in text.split():
        yield word + " "

@app.post("/chat-stream")
def chat_stream(q: Query):
    try:
        history = get_history()

        rag_data = rag_tool(q.question)
        github_data = github_tool()

        combined = f"""
{rag_data}

Total Projects: {github_data.get("total_projects")}
"""

        response = (
            answer_prompt
            | chat_model
            | parser
        ).invoke({
            "data": combined,
            "question": q.question,
            "history": history
        })

        return StreamingResponse(
            stream_text(response),
            media_type="text/plain"
        )

    except Exception as e:
        return {"error": str(e)}