# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse
# from pydantic import BaseModel
# from dotenv import load_dotenv
# import os
# import requests
# import gc

# from groq import Groq

# from langchain_community.vectorstores import FAISS
# from langchain_community.document_loaders import TextLoader, WebBaseLoader
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_huggingface import HuggingFaceEmbeddings, HuggingFaceEndpoint, ChatHuggingFace

# from langchain_core.prompts import ChatPromptTemplate
# from langchain_core.output_parsers import StrOutputParser
# from langchain_core.messages import HumanMessage, AIMessage

# # =========================
# # 🔐 ENV
# # =========================
# load_dotenv()

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # =========================
# # 📁 LOAD DATA
# # =========================
# loader1 = TextLoader("data/resume.txt")
# loader2 = TextLoader("data/projects.txt")
# loader3 = TextLoader("data/personal.txt")

# docs = loader1.load() + loader2.load() + loader3.load()

# portfolio_loader = WebBaseLoader("https://kanhaiya-kr-portfolio.vercel.app/")
# docs.extend(portfolio_loader.load())

# # =========================
# # ✂️ SPLIT
# # =========================
# splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=30)
# chunks = splitter.split_documents(docs)

# # =========================
# # 🧠 LAZY VECTORSTORE
# # =========================
# embeddings = None
# db = None

# def get_vectorstore():
#     global embeddings, db
#     if db is None:
#         embeddings = HuggingFaceEmbeddings(
#             model_name="sentence-transformers/paraphrase-MiniLM-L3-v2"
#         )
#         db = FAISS.from_documents(chunks, embeddings)
#     return db

# # =========================
# # 💬 MEMORY
# # =========================
# chat_history = []

# def get_history():
#     return "\n".join([msg.content for msg in chat_history[-6:]])

# # =========================
# # 🔧 TOOLS
# # =========================
# def rag_tool(question):
#     db = get_vectorstore()
#     retriever = db.as_retriever(search_type="mmr", search_kwargs={"k": 3})
#     docs = retriever.invoke(question)
#     gc.collect()
#     return "\n".join([d.page_content for d in docs])


# def github_tool():
#     try:
#         url = "https://api.github.com/users/iamkanhaiyakumar/repos"
#         headers = {"Authorization": f"Bearer {os.getenv('GITHUB_TOKEN')}"}
#         res = requests.get(url, headers=headers, timeout=5)
#         repos = res.json()

#         repos = sorted(repos, key=lambda x: x.get("stargazers_count", 0), reverse=True)
#         repos = repos[:10]

#         return {
#             "total_projects": len(repos),
#             "top_projects": [r["name"] for r in repos[:3]]
#         }
#     except:
#         return {"total_projects": 0, "top_projects": []}


# def portfolio_tool():
#     try:
#         loader = WebBaseLoader("https://kanhaiya-kr-portfolio.vercel.app/")
#         docs = loader.load()
#         return "\n".join([d.page_content for d in docs])
#     except:
#         return "Portfolio data not available"

# # =========================
# # 🤖 GROQ
# # =========================
# groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# def groq_chat(question):
#     try:
#         res = groq_client.chat.completions.create(
#             model="llama-3.3-70b-versatile",
#             messages=[
#                 {"role": "system", "content": "Reply in 1–2 short sentences."},
#                 {"role": "user", "content": question}
#             ],
#             max_tokens=80
#         )
#         return res.choices[0].message.content.strip()
#     except:
#         return None


# def groq_stream(question):
#     completion = groq_client.chat.completions.create(
#         model="llama-3.3-70b-versatile",
#         messages=[
#             {"role": "system", "content": "Reply in 1–2 short sentences."},
#             {"role": "user", "content": question}
#         ],
#         stream=True
#     )

#     for chunk in completion:
#         if chunk.choices[0].delta.content:
#             yield chunk.choices[0].delta.content

# # =========================
# # 🤖 HUGGING FACE
# # =========================
# llm = HuggingFaceEndpoint(
#     repo_id="meta-llama/Llama-3.1-8B-Instruct",
#     task="text-generation",
#     huggingfacehub_api_token=os.getenv("HUGGINGFACEHUB_API_TOKEN")
# )

# chat_model = ChatHuggingFace(llm=llm)
# parser = StrOutputParser()

# # =========================
# # 🧠 TOOL SELECTOR (KEPT)
# # =========================
# tool_selector_prompt = ChatPromptTemplate.from_template("""
# You are a decision system.

# Rules:
# - resume, skills, projects → rag
# - latest work → github
# - website → portfolio

# Return ONLY: rag / github / portfolio

# Question: {question}
# """)

# # =========================
# # 🧾 FINAL PROMPT (YOUR RULES KEPT)
# # =========================
# answer_prompt = ChatPromptTemplate.from_template("""
# You are Kanhaiya’s AI assistant.

# STRICT RULES:
# - Answer in 1–2 short sentences
# - Be human-like and natural
# - Never say "not found"
# - NEVER hallucinate
# - ALWAYS use provided data
# - ALWAYS return links EXACTLY if asked

# # IMPORTANT:
# - COUNT → use GitHub total_projects
# - Include top project names
# - Prefer RAG over guessing

# Data:
# {data}

# Question:
# {question}

# Answer:
# """)

# # =========================
# # 📥 REQUEST
# # =========================
# class Query(BaseModel):
#     question: str

# # =========================
# # 🌐 CHAT API
# # =========================
# @app.post("/chat")
# def chat(q: Query):
#     try:
#         question = q.question.lower()

#         # 🔗 DIRECT LINKS (STRICT)
#         if "resume" in question:
#             return {"type": "resume", "links": {"resume": "https://kanhaiya-kr-portfolio.vercel.app/Kanhaiya-Kumar-Resume.pdf"}}

#         if "github" in question:
#             return {"type": "github", "links": {"github": "https://github.com/iamkanhaiyakumar"}}

#         if "linkedin" in question:
#             return {"type": "linkedin", "links": {"linkedin": "https://www.linkedin.com/in/kanhaiyak0104"}}

#         # 🧠 TOOL SELECTOR
#         tool = (
#             tool_selector_prompt
#             | chat_model
#             | parser
#         ).invoke({"question": q.question}).strip()

#         # ⚡ SMALL TALK → GROQ
#         if len(q.question.split()) <= 3:
#             fast = groq_chat(q.question)
#             if fast:
#                 return {"type": "text", "answer": fast}

#         # 🔥 TOOL EXECUTION
#         if tool == "github":
#             data = github_tool()
#         elif tool == "portfolio":
#             data = portfolio_tool()
#         else:
#             data = rag_tool(q.question)

#         # 🔥 MERGED DATA (FIXED)
#         combined = f"""
# RAG DATA:
# {rag_tool(q.question)}

# GITHUB DATA:
# Total Projects: {github_tool().get("total_projects")}
# Top Projects: {github_tool().get("top_projects")}
# """

#         response = (
#             answer_prompt
#             | chat_model
#             | parser
#         ).invoke({
#             "data": combined,
#             "question": q.question
#         })

#         return {"type": "text", "answer": response.strip()}

#     except Exception as e:
#         return {"error": str(e)}

# # =========================
# # ⚡ STREAM
# # =========================
# @app.post("/chat-stream")
# def chat_stream(q: Query):

#     if len(q.question.split()) <= 3:
#         return StreamingResponse(groq_stream(q.question), media_type="text/plain")

#     rag_data = rag_tool(q.question)

#     response = (
#         answer_prompt
#         | chat_model
#         | parser
#     ).invoke({
#         "data": rag_data,
#         "question": q.question
#     })

#     def stream():
#         for word in response.split():
#             yield word + " "

#     return StreamingResponse(stream(), media_type="text/plain")




from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os

from groq import Groq

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
# 📁 LOAD DATA (LIGHTWEIGHT RAG)
# =========================
def load_data():
    data = ""

    try:
        with open("data/resume.txt", "r", encoding="utf-8") as f:
            data += f.read() + "\n"

        with open("data/projects.txt", "r", encoding="utf-8") as f:
            data += f.read() + "\n"

        with open("data/personal.txt", "r", encoding="utf-8") as f:
            data += f.read() + "\n"

    except Exception as e:
        data = "No data available"

    return data

DOCUMENT_DATA = load_data()

# =========================
# 🧠 SIMPLE RAG FUNCTION
# =========================
def get_context(question: str):
    # very simple keyword filter (lightweight)
    q = question.lower()

    if "project" in q:
        return DOCUMENT_DATA[:1500]

    if "skill" in q:
        return DOCUMENT_DATA[:1200]

    return DOCUMENT_DATA[:1000]


# =========================
# 💬 MEMORY (LAST 3 CHATS)
# =========================
chat_history = []

def get_history():
    return "\n".join(chat_history[-3:])


# =========================
# 🤖 GROQ (FAST LLM)
# =========================
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def groq_chat(prompt):
    try:
        res = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "Reply in 1-2 short sentences."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=80
        )
        return res.choices[0].message.content.strip()
    except Exception as e:
        return "Error generating response"


def groq_stream(prompt):
    completion = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "Reply in 1-2 short sentences."},
            {"role": "user", "content": prompt}
        ],
        stream=True
    )

    for chunk in completion:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content


# =========================
# 📥 REQUEST MODEL
# =========================
class Query(BaseModel):
    question: str


# =========================
# 🧠 FINAL PROMPT BUILDER
# =========================
def build_prompt(question, context, history):
    return f"""
You are Kanhaiya's AI assistant.

Rules:
- Answer in 1–2 short sentences
- Be natural and human-like
- Do not say "not available"
- Use context if needed

Conversation:
{history}

Context:
{context}

Question:
{question}
"""


# =========================
# 🌐 NORMAL CHAT API
# =========================
@app.post("/chat")
def chat(q: Query):
    question = q.question.lower()
    history = get_history()

    # 🔗 Quick Links
    if "resume" in question:
        return {
            "type": "resume",
            "answer": "Here is his resume",
            "links": {
                "resume": "https://kanhaiya-kr-portfolio.vercel.app/Kanhaiya-Kumar-Resume.pdf"
            }
        }

    if "github" in question:
        return {
            "type": "github",
            "answer": "Here is his GitHub",
            "links": {
                "github": "https://github.com/iamkanhaiyakumar"
            }
        }

    if "linkedin" in question:
        return {
            "type": "linkedin",
            "answer": "Here is his LinkedIn",
            "links": {
                "linkedin": "https://www.linkedin.com/in/kanhaiyak0104"
            }
        }

    # 🔥 RAG + LLM
    context = get_context(q.question)
    prompt = build_prompt(q.question, context, history)

    answer = groq_chat(prompt)

    # save memory
    chat_history.append(f"User: {q.question}")
    chat_history.append(f"AI: {answer}")

    return {"type": "text", "answer": answer}


# =========================
# ⚡ STREAMING API
# =========================
@app.post("/chat-stream")
def chat_stream(q: Query):
    history = get_history()
    context = get_context(q.question)
    prompt = build_prompt(q.question, context, history)

    return StreamingResponse(
        groq_stream(prompt),
        media_type="text/plain"
    )