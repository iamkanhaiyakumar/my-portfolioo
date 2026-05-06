from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import re
import math
import json
import requests
from collections import Counter
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
# 📁 LOAD ALL DATA SOURCES
# =========================
def load_file(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except:
        return ""

# Load all knowledge base files
KNOWLEDGE_FILES = [
    "data/resume.txt",
    "data/projects.txt",
    "data/personal.txt",
    "data/github_profile.txt",
    "data/linkedin_profile.txt",
]

RAW_DATA = ""
for f in KNOWLEDGE_FILES:
    content = load_file(f)
    if content:
        RAW_DATA += content + "\n\n"

print(f"✅ Loaded {len(RAW_DATA)} characters from {len(KNOWLEDGE_FILES)} knowledge files")

# =========================
# ✂️ SMART CHUNKING
# =========================
def smart_chunk(text, max_size=400, overlap=80):
    """Sentence-boundary aware chunking with overlap"""
    # Split by section markers first
    sections = re.split(r'\n\[([A-Z_]+)\]\n', text)
    
    chunks = []
    for section in sections:
        # Split into sentences
        sentences = re.split(r'(?<=[.!?\n])\s+', section.strip())
        
        current_chunk = ""
        for sentence in sentences:
            if len(current_chunk) + len(sentence) > max_size and current_chunk:
                chunks.append(current_chunk.strip())
                # Keep overlap from end of previous chunk
                words = current_chunk.split()
                overlap_text = " ".join(words[-15:]) if len(words) > 15 else ""
                current_chunk = overlap_text + " " + sentence
            else:
                current_chunk += " " + sentence
        
        if current_chunk.strip():
            chunks.append(current_chunk.strip())
    
    # Remove very short chunks (less than 30 chars)
    chunks = [c for c in chunks if len(c) > 30]
    
    print(f"✅ Created {len(chunks)} semantic chunks")
    return chunks

CHUNKS = smart_chunk(RAW_DATA)

# =========================
# 🔍 TF-IDF RETRIEVAL
# =========================
def tokenize(text):
    """Simple tokenizer: lowercase, alphanumeric only"""
    return re.findall(r'[a-z0-9]+', text.lower())

# Pre-compute IDF
all_tokens = [tokenize(chunk) for chunk in CHUNKS]
doc_count = len(CHUNKS)

# Document frequency for each term
df = Counter()
for tokens in all_tokens:
    unique_tokens = set(tokens)
    for token in unique_tokens:
        df[token] += 1

def compute_idf(term):
    """Inverse Document Frequency"""
    return math.log((doc_count + 1) / (df.get(term, 0) + 1)) + 1

def tfidf_score(query_tokens, chunk_tokens):
    """Compute TF-IDF similarity between query and chunk"""
    if not chunk_tokens:
        return 0
    
    chunk_tf = Counter(chunk_tokens)
    chunk_len = len(chunk_tokens)
    
    score = 0
    for token in query_tokens:
        tf = chunk_tf.get(token, 0) / chunk_len
        idf = compute_idf(token)
        score += tf * idf
    
    return score

def retrieve_context(question, top_k=4):
    """TF-IDF based retrieval — much better than keyword matching"""
    query_tokens = tokenize(question)
    
    # Also add expanded query terms for common synonyms
    expansions = {
        "project": ["projects", "built", "developed", "created"],
        "skill": ["skills", "proficient", "experienced", "knowledge"],
        "experience": ["internship", "work", "role", "job"],
        "contact": ["email", "phone", "whatsapp", "reach"],
        "education": ["college", "university", "degree", "btech"],
        "achievement": ["achievements", "award", "rank", "competition"],
        "who": ["name", "kanhaiya", "about", "person"],
        "what": ["does", "work", "skills", "projects"],
    }
    
    expanded = list(query_tokens)
    for token in query_tokens:
        if token in expansions:
            expanded.extend(expansions[token])
    
    scored = []
    for i, chunk in enumerate(CHUNKS):
        score = tfidf_score(expanded, all_tokens[i])
        
        # Boost chunks that contain exact query words
        chunk_lower = chunk.lower()
        exact_bonus = sum(1 for t in query_tokens if t in chunk_lower) * 0.3
        score += exact_bonus
        
        scored.append((score, chunk))
    
    scored.sort(reverse=True, key=lambda x: x[0])
    
    # Only return chunks with meaningful scores
    top_chunks = []
    for score, chunk in scored[:top_k]:
        if score > 0.1:  # Minimum relevance threshold
            top_chunks.append(chunk)
    
    if not top_chunks:
        # Fallback: return first chunk which usually has basic info
        top_chunks = [CHUNKS[0]] if CHUNKS else ["Kanhaiya Kumar is an AI/ML Engineer from Bhopal, India."]
    
    return "\n---\n".join(top_chunks)

# =========================
# 💬 CONVERSATION MEMORY
# =========================
chat_history = []

def get_history_messages():
    """Return last 8 messages as structured conversation"""
    return chat_history[-8:]

def get_history_text():
    """Return history as formatted text"""
    messages = get_history_messages()
    if not messages:
        return "No previous conversation."
    return "\n".join([f"{m['role'].title()}: {m['content']}" for m in messages])

# =========================
# 🧠 INTENT CLASSIFICATION
# =========================
def classify_intent(question):
    """Classify user intent for smart routing"""
    q = question.lower().strip()
    
    # Greeting
    if any(w in q for w in ["hi", "hello", "hey", "hii", "howdy", "sup", "namaste", "good morning", "good evening"]):
        if len(q.split()) <= 4:
            return "greeting"
    
    # Link requests
    if "resume" in q or "cv" in q:
        return "resume"
    if "github" in q and ("link" in q or "profile" in q or "show" in q or len(q.split()) <= 3):
        return "github_link"
    if "linkedin" in q or "linked in" in q:
        return "linkedin_link"
    if "whatsapp" in q or "phone" in q or "call" in q or "number" in q:
        return "contact"
    if "email" in q or "mail" in q:
        return "email"
    if "portfolio" in q and ("link" in q or "website" in q or "url" in q):
        return "portfolio_link"
    
    # Farewell
    if any(w in q for w in ["bye", "goodbye", "thanks", "thank you", "see you"]):
        return "farewell"
    
    return "general"

# =========================
# 🤖 GROQ LLM (FAST)
# =========================
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are Kanhaiya's intelligent AI portfolio assistant. You represent Kanhaiya Kumar — an aspiring AI/ML Engineer from Bhopal, India.

YOUR PERSONALITY:
- Friendly, professional, and enthusiastic about Kanhaiya's work
- Speak in third person about Kanhaiya (e.g., "He has built...", "Kanhaiya is skilled in...")
- Be concise but informative — aim for 2-3 sentences max
- Show genuine enthusiasm when talking about his projects and achievements

STRICT RULES:
1. ONLY answer questions about Kanhaiya Kumar using the provided context
2. Never say "I don't know" or "information not available" — always find something relevant to share
3. When asked about projects, always mention specific project names and technologies used
4. When asked about skills, group them logically (AI/ML, Web Dev, Languages, Tools)
5. NEVER make up information that isn't in the context
6. If asked about something unrelated to Kanhaiya, politely redirect: "I'm Kanhaiya's AI assistant! I can tell you about his projects, skills, experience, or achievements."
7. When returning links, return the EXACT URL without modification
8. For follow-up questions, use conversation history to maintain context
9. Use emojis sparingly to keep it professional but warm (max 1-2 per response)
10. Highlight key achievements: IEEE publication, 16th rank Naukri Campus, 92% PPE detection accuracy
11. If asked "how many projects" — mention he has 49 public repositories on GitHub with key ones being PPE Detection, AI Content Generator, Book Recommender, Job Role Prediction
12. Always be ready to mention his key differentiators: IEEE publication, real-world AI deployments, mentoring 150+ students"""

def generate_answer(question, context, history_text):
    """Generate answer using Groq with rich context"""
    try:
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
        ]
        
        # Add conversation history as separate messages for better context
        for msg in get_history_messages():
            messages.append(msg)
        
        # Build the user message with context
        user_prompt = f"""Context about Kanhaiya:
{context}

User's Question: {question}

Respond naturally and concisely (2-3 sentences max). Use the context above to give an accurate, helpful answer."""
        
        messages.append({"role": "user", "content": user_prompt})
        
        res = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=200,
            temperature=0.7,
        )
        return res.choices[0].message.content.strip()
    except Exception as e:
        print(f"❌ Groq error: {e}")
        return "I'm having trouble connecting right now. Please try again in a moment! 🔄"

def stream_answer(question, context, history_text):
    """Stream answer using Groq"""
    try:
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
        ]
        
        for msg in get_history_messages():
            messages.append(msg)
        
        user_prompt = f"""Context about Kanhaiya:
{context}

User's Question: {question}

Respond naturally and concisely (2-3 sentences max). Use the context above to give an accurate, helpful answer."""
        
        messages.append({"role": "user", "content": user_prompt})
        
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=200,
            temperature=0.7,
            stream=True
        )
        
        full_response = ""
        for chunk in completion:
            if chunk.choices[0].delta.content:
                content = chunk.choices[0].delta.content
                full_response += content
                yield content
        
        # Save to history after streaming completes
        chat_history.append({"role": "user", "content": question})
        chat_history.append({"role": "assistant", "content": full_response})
        
    except Exception as e:
        print(f"❌ Stream error: {e}")
        yield "I'm having trouble connecting right now. Please try again! 🔄"

# =========================
# 🔗 QUICK RESPONSES
# =========================
QUICK_RESPONSES = {
    "greeting": {
        "type": "text",
        "answer": "Hey there! 👋 I'm Kanhaiya's AI assistant. Ask me anything about his projects, skills, experience, or achievements — I'm here to help!"
    },
    "resume": {
        "type": "resume",
        "answer": "Here's Kanhaiya's resume — it covers his skills, projects, and experience in AI/ML engineering! 📄",
        "links": {
            "resume": "https://kanhaiya-kr-portfolio.vercel.app/Kanhaiya-Kumar-Resume.pdf"
        }
    },
    "github_link": {
        "type": "github",
        "answer": "Here's Kanhaiya's GitHub — he has 49+ repositories covering AI/ML, web development, and more! 💻",
        "links": {
            "github": "https://github.com/iamkanhaiyakumar"
        }
    },
    "linkedin_link": {
        "type": "linkedin",
        "answer": "Here's Kanhaiya's LinkedIn profile — feel free to connect with him! 🔗",
        "links": {
            "linkedin": "https://www.linkedin.com/in/kanhaiyak0104"
        }
    },
    "contact": {
        "type": "text",
        "answer": "You can reach Kanhaiya via WhatsApp at +91 6206686966 or email at kanhaiyak0104@gmail.com 📱"
    },
    "email": {
        "type": "text",
        "answer": "Kanhaiya's email is kanhaiyak0104@gmail.com — feel free to reach out! 📧"
    },
    "portfolio_link": {
        "type": "text",
        "answer": "You're already on Kanhaiya's portfolio! 🌐 It's also live at https://kanhaiya-k-portfolioo.vercel.app"
    },
    "farewell": {
        "type": "text",
        "answer": "Thanks for visiting! Feel free to come back anytime. You can also reach Kanhaiya via email or LinkedIn. Have a great day! 👋"
    }
}

# =========================
# 📥 REQUEST MODEL
# =========================
class Query(BaseModel):
    question: str

# =========================
# 🌐 CHAT API (NON-STREAMING)
# =========================
@app.post("/chat")
def chat(q: Query):
    try:
        question = q.question.strip()
        intent = classify_intent(question)
        
        # Quick responses for specific intents
        if intent in QUICK_RESPONSES:
            response = QUICK_RESPONSES[intent]
            # Still save to history
            chat_history.append({"role": "user", "content": question})
            chat_history.append({"role": "assistant", "content": response["answer"]})
            return response
        
        # RAG flow for general questions
        history_text = get_history_text()
        context = retrieve_context(question)
        answer = generate_answer(question, context, history_text)
        
        # Save to history
        chat_history.append({"role": "user", "content": question})
        chat_history.append({"role": "assistant", "content": answer})
        
        return {
            "type": "text",
            "answer": answer
        }
    
    except Exception as e:
        print(f"❌ Chat error: {e}")
        return {
            "type": "text",
            "answer": "I'm having a brief hiccup. Please try asking again! 🔄"
        }

# =========================
# ⚡ STREAMING CHAT API
# =========================
@app.post("/chat-stream")
def chat_stream(q: Query):
    try:
        question = q.question.strip()
        intent = classify_intent(question)
        
        # Quick responses — stream them word by word for consistent UX
        if intent in QUICK_RESPONSES:
            response = QUICK_RESPONSES[intent]
            chat_history.append({"role": "user", "content": question})
            chat_history.append({"role": "assistant", "content": response["answer"]})
            
            def stream_quick():
                for word in response["answer"].split():
                    yield word + " "
            
            return StreamingResponse(stream_quick(), media_type="text/plain")
        
        # RAG streaming flow
        history_text = get_history_text()
        context = retrieve_context(question)
        
        return StreamingResponse(
            stream_answer(question, context, history_text),
            media_type="text/plain"
        )
    
    except Exception as e:
        print(f"❌ Stream error: {e}")
        def error_stream():
            yield "I'm having trouble right now. Please try again! 🔄"
        return StreamingResponse(error_stream(), media_type="text/plain")

# =========================
# 🏥 HEALTH CHECK
# =========================
@app.get("/health")
def health():
    return {
        "status": "ok",
        "chunks": len(CHUNKS),
        "data_size": len(RAW_DATA),
        "history_length": len(chat_history)
    }

print("🚀 Portfolio RAG Backend Ready!")
print(f"📊 {len(CHUNKS)} chunks | {len(RAW_DATA)} chars of knowledge")