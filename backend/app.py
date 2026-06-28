import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import re
import math
import json
import time
import requests
import numpy as np
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

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
JINA_API_KEY = os.getenv("JINA_API_KEY")

# =========================
# 📁 LOAD ALL DATA SOURCES
# =========================
def load_file(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except:
        return ""

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

print(f"[OK] Loaded {len(RAW_DATA)} characters from knowledge files")

# =========================
# 📄 LOAD STATIC ANSWERS
# =========================
try:
    with open("static_answers.json", "r", encoding="utf-8") as f:
        STATIC_ANSWERS = json.load(f)
    print("✅ Static answers loaded")
except:
    STATIC_ANSWERS = {
        "default": "I'm Kanhaiya's AI assistant! Ask me about his skills, projects, or experience. 😊"
    }

STATIC_KEYWORDS = {
    "skills":      ["skill", "technology", "tech", "know", "language", "tool", "proficient", "expertise"],
    "projects":    ["project", "built", "developed", "created", "made", "repo", "github projects"],
    "education":   ["education", "college", "university", "degree", "study", "btech", "cgpa", "marks"],
    "experience":  ["experience", "intern", "work", "job", "role", "infosys", "springboard"],
    "achievements":["achievement", "award", "rank", "win", "accomplish", "naukri", "gdsc", "hackerrank"],
    "contact":     ["contact", "email", "phone", "reach", "whatsapp", "call", "message"],
    "github":      ["github", "repositories", "repo", "code", "open source"],
    "linkedin":    ["linkedin", "linked in", "connect", "profile"],
    "resume":      ["resume", "cv", "curriculum"],
    "publication": ["publication", "ieee", "research", "paper", "journal"],
    "about":       ["who", "about", "kanhaiya", "introduce", "tell me about"],
    "ppe":         ["ppe", "safety", "helmet", "detection", "yolo", "opencv"],
    "langchain":   ["langchain", "rag", "generative", "llm", "gpt", "chatgpt", "ai model"],
}

def get_static_answer(question):
    """Keyword-based static answer matching"""
    q = question.lower()
    for category, keywords in STATIC_KEYWORDS.items():
        if any(kw in q for kw in keywords):
            return STATIC_ANSWERS.get(category, STATIC_ANSWERS["default"])
    return STATIC_ANSWERS["default"]

# =========================
# ✂️ SMART CHUNKING
# =========================
def smart_chunk(text, max_size=400, overlap=80):
    """Sentence-boundary aware chunking with overlap"""
    sections = re.split(r'\n\[([A-Z_]+)\]\n', text)
    chunks = []
    for section in sections:
        sentences = re.split(r'(?<=[.!?\n])\s+', section.strip())
        current_chunk = ""
        for sentence in sentences:
            if len(current_chunk) + len(sentence) > max_size and current_chunk:
                chunks.append(current_chunk.strip())
                words = current_chunk.split()
                overlap_text = " ".join(words[-15:]) if len(words) > 15 else ""
                current_chunk = overlap_text + " " + sentence
            else:
                current_chunk += " " + sentence
        if current_chunk.strip():
            chunks.append(current_chunk.strip())

    chunks = [c for c in chunks if len(c) > 30]
    print(f"[OK] Created {len(chunks)} semantic chunks")
    return chunks

CHUNKS = smart_chunk(RAW_DATA)

# =========================
# 🔍 TF-IDF (OFFLINE FALLBACK)
# =========================
def tokenize(text):
    return re.findall(r'[a-z0-9]+', text.lower())

all_tokens = [tokenize(chunk) for chunk in CHUNKS]
doc_count = len(CHUNKS)

df = Counter()
for tokens in all_tokens:
    unique_tokens = set(tokens)
    for token in unique_tokens:
        df[token] += 1

def compute_idf(term):
    return math.log((doc_count + 1) / (df.get(term, 0) + 1)) + 1

def tfidf_score(query_tokens, chunk_tokens):
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

def tfidf_retrieve(question, top_k=4):
    """TF-IDF fallback retrieval"""
    query_tokens = tokenize(question)
    expansions = {
        "project":     ["projects", "built", "developed", "created"],
        "skill":       ["skills", "proficient", "experienced", "knowledge"],
        "experience":  ["internship", "work", "role", "job"],
        "contact":     ["email", "phone", "whatsapp", "reach"],
        "education":   ["college", "university", "degree", "btech"],
        "achievement": ["achievements", "award", "rank", "competition"],
        "who":         ["name", "kanhaiya", "about", "person"],
    }
    expanded = list(query_tokens)
    for token in query_tokens:
        if token in expansions:
            expanded.extend(expansions[token])

    scored = []
    for i, chunk in enumerate(CHUNKS):
        score = tfidf_score(expanded, all_tokens[i])
        chunk_lower = chunk.lower()
        exact_bonus = sum(1 for t in query_tokens if t in chunk_lower) * 0.3
        score += exact_bonus
        scored.append((score, chunk))

    scored.sort(reverse=True, key=lambda x: x[0])
    top_chunks = [chunk for score, chunk in scored[:top_k] if score > 0.1]

    if not top_chunks:
        top_chunks = [CHUNKS[0]] if CHUNKS else ["Kanhaiya Kumar is an AI/ML Engineer from Bhopal, India."]

    return "\n---\n".join(top_chunks)

# =========================
# 🌐 JINA AI EMBEDDINGS (ONLINE PRIMARY)
# =========================
JINA_EMBED_URL = "https://api.jina.ai/v1/embeddings"
JINA_HEADERS = {
    "Authorization": f"Bearer {JINA_API_KEY}",
    "Content-Type": "application/json"
}

# In-memory vector store
CHUNK_VECTORS = []  # list of numpy arrays
FAISS_READY = False

def jina_embed(texts: list, retries=3):
    """Get embeddings from Jina AI API with exponential backoff"""
    for attempt in range(retries):
        try:
            res = requests.post(
                JINA_EMBED_URL,
                headers=JINA_HEADERS,
                json={
                    "input": texts,
                    "model": "jina-embeddings-v2-base-en"
                },
                timeout=20
            )
            if res.status_code == 200:
                data = res.json()
                return [item["embedding"] for item in data["data"]]
            elif res.status_code == 429:  # Rate limit
                wait = 2 ** attempt * 2  # 2s, 4s, 8s
                print(f"[WARN] Jina rate limit hit - waiting {wait}s before retry {attempt+1}")
                time.sleep(wait)
            else:
                print(f"[WARN] Jina API error {res.status_code}: {res.text[:200]}")
                if attempt < retries - 1:
                    time.sleep(2 ** attempt)
        except Exception as e:
            print(f"[WARN] Jina embed attempt {attempt+1} failed: {e}")
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
    return None

def cosine_similarity(vec_a, vec_b):
    """Compute cosine similarity between two vectors"""
    a = np.array(vec_a)
    b = np.array(vec_b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))

def build_vector_index():
    """Build in-memory vector index from all chunks using Jina AI"""
    global CHUNK_VECTORS, FAISS_READY
    print("[INFO] Building vector index with Jina AI embeddings...")

    # Embed in smaller batches with delay to avoid rate limits
    batch_size = 8
    all_vectors = []
    total_batches = math.ceil(len(CHUNKS) / batch_size)

    for i in range(0, len(CHUNKS), batch_size):
        batch = CHUNKS[i:i + batch_size]
        batch_num = i // batch_size + 1
        vectors = jina_embed(batch)
        if vectors:
            all_vectors.extend(vectors)
            print(f"  [OK] Embedded batch {batch_num}/{total_batches}")
            # Small delay between batches to respect rate limits
            if batch_num < total_batches:
                time.sleep(0.5)
        else:
            print(f"  [WARN] Batch {batch_num}/{total_batches} failed - switching to TF-IDF fallback")
            FAISS_READY = False
            return

    CHUNK_VECTORS = all_vectors
    FAISS_READY = True
    print(f"[OK] Vector index ready! {len(CHUNK_VECTORS)} chunk vectors stored")
    # Cooldown after index build so query calls don't hit rate limit
    print("[INFO] Cooling down 3s after index build...")
    time.sleep(3)

def vector_retrieve(question, top_k=5):
    """Semantic retrieval using Jina AI embeddings + cosine similarity"""
    query_vectors = jina_embed([question])
    if not query_vectors:
        raise Exception("Jina embed failed for query")

    query_vec = query_vectors[0]
    scores = [cosine_similarity(query_vec, cv) for cv in CHUNK_VECTORS]
    top_indices = np.argsort(scores)[::-1][:top_k]

    # Always return top results regardless of score threshold
    top_chunks = [CHUNKS[i] for i in top_indices]

    return "\n---\n".join(top_chunks)

# Build the vector index at startup
build_vector_index()

# =========================
# 🎯 SMART RETRIEVAL (3 LAYERS)
# =========================
def retrieve_context(question):
    """
    Layer 1: Jina AI semantic search (online)
    Layer 2: TF-IDF keyword search (offline fallback)
    """
    # Layer 1 — Semantic (online)
    if FAISS_READY:
        try:
            context = vector_retrieve(question)
            print("[OK] [Layer 1] Semantic retrieval used")
            return context, "semantic"
        except Exception as e:
            print(f"[WARN] [Layer 1] Semantic failed: {e} - falling back to TF-IDF")

    # Layer 2 — TF-IDF (offline)
    context = tfidf_retrieve(question)
    print("[INFO] [Layer 2] TF-IDF retrieval used")
    return context, "tfidf"

# =========================
# 💬 CONVERSATION MEMORY
# =========================
chat_history = []

def get_history_messages():
    return chat_history[-8:]

def get_history_text():
    messages = get_history_messages()
    if not messages:
        return "No previous conversation."
    return "\n".join([f"{m['role'].title()}: {m['content']}" for m in messages])

# =========================
# 🧠 INTENT CLASSIFICATION
# =========================
def classify_intent(question):
    q = question.lower().strip()

    if any(w in q for w in ["hi", "hello", "hey", "hii", "howdy", "sup", "namaste", "good morning", "good evening"]):
        if len(q.split()) <= 4:
            return "greeting"

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
    if any(w in q for w in ["bye", "goodbye", "thanks", "thank you", "see you"]):
        return "farewell"

    return "general"

# =========================
# 🤖 GROQ LLM
# =========================
groq_client = Groq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = """You are Kanhaiya's intelligent AI portfolio assistant. You represent Kanhaiya Kumar — an aspiring AI/ML Engineer from Bhopal, India.

YOUR PERSONALITY:
- Friendly, professional, and enthusiastic about Kanhaiya's work
- Speak in third person about Kanhaiya (e.g., "He has built...", "Kanhaiya is skilled in...")
- Be concise but informative — aim for 2-3 sentences max (can go up to 4 sentences when explaining general technical concepts)
- Show genuine enthusiasm when talking about his projects and achievements

STRICT RULES:
1. Primary focus is Kanhaiya Kumar's portfolio, skills, projects, and experiences. Answer portfolio queries using the provided context.
2. If asked general or external technical questions (e.g., "what is Git", "how does YOLO work", "explain next.js"), you SHOULD answer them clearly and accurately. When possible, elegantly tie the concept back to Kanhaiya's portfolio (e.g., "Kanhaiya uses Git and GitHub to manage his 51+ public repositories").
3. Never say "I don't know" or "information not available" for portfolio-related queries — always find something relevant to share.
4. When asked about projects, always mention specific project names and technologies used.
5. When asked about skills, group them logically (AI/ML, Web Dev, Languages, Tools).
6. NEVER make up information about Kanhaiya's personal credentials or project metrics that isn't in the context.
7. When returning links, return the EXACT URL without modification.
8. For follow-up questions, use conversation history to maintain context.
9. Use emojis sparingly to keep it professional but warm (max 1-2 per response).
10. Highlight key achievements: IEEE publication, 16th rank Naukri Campus, 92% PPE detection accuracy.
11. If asked "how many projects" — mention he has 51 public repositories on GitHub.
12. Always be ready to mention his key differentiators: IEEE publication, real-world AI deployments, mentoring 150+ students."""

def generate_huggingface_fallback(question, context):
    """Fallback LLM generation using Hugging Face Serverless Inference API"""
    hf_key = os.getenv("HF_API_KEY") or os.getenv("HF_TOKEN")
    if not hf_key:
        print("[WARN] No Hugging Face API key found in env - skipping LLM fallback")
        return None

    print("[INFO] Attempting LLM fallback with Hugging Face...")
    try:
        model_id = "meta-llama/Meta-Llama-3-8B-Instruct"
        api_url = f"https://api-inference.huggingface.co/models/{model_id}"
        headers = {
            "Authorization": f"Bearer {hf_key}",
            "Content-Type": "application/json"
        }
        
        prompt = f"<|system|>\n{SYSTEM_PROMPT}\n<|user|>\nContext: {context}\nQuestion: {question}\n<|assistant|>\n"
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 150,
                "temperature": 0.7,
                "return_full_text": False
            }
        }
        
        res = requests.post(api_url, headers=headers, json=payload, timeout=12)
        if res.status_code == 200:
            data = res.json()
            if isinstance(data, list) and len(data) > 0:
                answer = data[0].get("generated_text", "").strip()
                if "<|assistant|>" in answer:
                    answer = answer.split("<|assistant|>")[-1].strip()
                print("[OK] Hugging Face fallback generation successful!")
                return answer
            elif isinstance(data, dict) and "generated_text" in data:
                return data["generated_text"].strip()
        print(f"[WARN] Hugging Face API error: {res.status_code} - {res.text[:200]}")
    except Exception as e:
        print(f"[ERROR] Hugging Face generation error: {e}")
    return None

def stream_answer(question, context):
    """Stream answer using Groq LLM with HuggingFace fallback"""
    try:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
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

        chat_history.append({"role": "user", "content": question})
        chat_history.append({"role": "assistant", "content": full_response})

    except Exception as e:
        print(f"[ERROR] Groq stream error: {e}")
        # LLM Fallback: Hugging Face
        hf_fallback = generate_huggingface_fallback(question, context)
        if hf_fallback:
            for word in hf_fallback.split():
                yield word + " "
            chat_history.append({"role": "user", "content": question})
            chat_history.append({"role": "assistant", "content": hf_fallback})
        else:
            # Layer 3 fallback: static answer
            static = get_static_answer(question)
            yield static
            chat_history.append({"role": "user", "content": question})
            chat_history.append({"role": "assistant", "content": static})

def generate_answer(question, context):
    """Non-streaming answer using Groq LLM with HuggingFace fallback"""
    try:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in get_history_messages():
            messages.append(msg)

        user_prompt = f"""Context about Kanhaiya:
{context}

User's Question: {question}

Respond naturally and concisely (2-3 sentences max)."""

        messages.append({"role": "user", "content": user_prompt})

        res = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=200,
            temperature=0.7,
        )
        return res.choices[0].message.content.strip()
    except Exception as e:
        print(f"[ERROR] Groq error: {e}")
        # LLM Fallback: Hugging Face
        hf_fallback = generate_huggingface_fallback(question, context)
        if hf_fallback:
            return hf_fallback
        # Layer 3 fallback: static answer
        return get_static_answer(question)

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
        "answer": "Here's Kanhaiya's GitHub — he has 10+ repositories covering AI/ML, web development, and more! 💻",
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

        # Quick responses (always available, no API needed)
        if intent in QUICK_RESPONSES:
            response = QUICK_RESPONSES[intent]
            chat_history.append({"role": "user", "content": question})
            chat_history.append({"role": "assistant", "content": response["answer"]})
            return response

        # Layer 1 & 2: Semantic or TF-IDF retrieval
        context, retrieval_type = retrieve_context(question)

        # Layer 3 fallback handled inside generate_answer if Groq fails
        answer = generate_answer(question, context)

        chat_history.append({"role": "user", "content": question})
        chat_history.append({"role": "assistant", "content": answer})

        return {
            "type": "text",
            "answer": answer,
            "retrieval": retrieval_type  # for debugging
        }

    except Exception as e:
        print(f"[ERROR] Chat error: {e}")
        static = get_static_answer(q.question)
        return {"type": "text", "answer": static}

# =========================
# ⚡ STREAMING CHAT API
# =========================
@app.post("/chat-stream")
def chat_stream(q: Query):
    try:
        question = q.question.strip()
        intent = classify_intent(question)

        # Quick responses — stream word by word
        if intent in QUICK_RESPONSES:
            response = QUICK_RESPONSES[intent]
            chat_history.append({"role": "user", "content": question})
            chat_history.append({"role": "assistant", "content": response["answer"]})

            def stream_quick():
                for word in response["answer"].split():
                    yield word + " "

            return StreamingResponse(stream_quick(), media_type="text/plain")

        # Layer 1 & 2: Retrieval
        try:
            context, retrieval_type = retrieve_context(question)
            print(f"[INFO] Retrieval: {retrieval_type}")
        except Exception as e:
            print(f"[WARN] All retrieval failed: {e} - using static answer")
            static = get_static_answer(question)
            def static_stream():
                for word in static.split():
                    yield word + " "
            return StreamingResponse(static_stream(), media_type="text/plain")

        # Stream from Groq (Layer 3 fallback inside stream_answer)
        return StreamingResponse(
            stream_answer(question, context),
            media_type="text/plain"
        )

    except Exception as e:
        print(f"[ERROR] Stream error: {e}")
        static = get_static_answer(q.question)
        def error_stream():
            for word in static.split():
                yield word + " "
        return StreamingResponse(error_stream(), media_type="text/plain")

# =========================
# 🔄 REBUILD INDEX ENDPOINT
# =========================
@app.post("/rebuild-index")
def rebuild_index():
    """Manually rebuild the vector index"""
    build_vector_index()
    return {
        "status": "ok",
        "chunks": len(CHUNKS),
        "vectors": len(CHUNK_VECTORS),
        "faiss_ready": FAISS_READY
    }

# =========================
# 🏥 HEALTH CHECK
# =========================
@app.get("/health")
def health():
    return {
        "status": "ok",
        "chunks": len(CHUNKS),
        "data_size": len(RAW_DATA),
        "vectors_built": FAISS_READY,
        "vector_count": len(CHUNK_VECTORS),
        "history_length": len(chat_history),
        "retrieval_mode": "semantic (Jina AI)" if FAISS_READY else "tfidf (offline fallback)"
    }

print("[READY] Portfolio Hybrid RAG Backend Ready!")
print(f"[INFO] {len(CHUNKS)} chunks | {len(RAW_DATA)} chars of knowledge")
print(f"[INFO] Jina AI: {'Ready' if JINA_API_KEY else 'No API key - TF-IDF fallback will be used'}")
print(f"[INFO] Groq: {'Ready' if GROQ_API_KEY else 'No API key - static fallback will be used'}")