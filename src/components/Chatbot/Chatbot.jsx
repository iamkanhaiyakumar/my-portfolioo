import React, { useState, useRef, useEffect } from "react";
import styles from "./Chatbot.module.css";

const SUGGESTIONS = [
  "Tell me about his projects",
  "What are his skills?",
  "Show resume",
  "Work experience",
  "GitHub profile",
];

// Use environment variable for backend URL, fallback to localhost for dev
const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV
    ? "http://localhost:8000"
    : "https://my-portfolioo-hs8y.onrender.com");

// Offline knowledge base for when backend is unavailable
const OFFLINE_RESPONSES = {
  greeting: "Hey there! 👋 I'm Kanhaiya's AI assistant. He's an aspiring AI/ML Engineer from Bhopal, India — B.Tech CSE (AI & ML) at LNCT Excellence with CGPA 7.43. Ask me about his projects, skills, or experience!",
  projects: "Kanhaiya has built 51+ projects! Key ones include:\n\n🔹 **PPE Kit Detection** — YOLOv8/v9 based safety detection (92% accuracy), IEEE published\n🔹 **AI Content Generator** — Next.js + TypeScript platform using LLM APIs\n🔹 **AI Resume Analyzer** — NLP-based resume parsing & skill matching\n🔹 **Book Recommender** — ML-based collaborative filtering system\n🔹 **Weather App** — Real-time weather using OpenWeather API\n🔹 **AI Mock Interview** — AI-powered interview simulation platform",
  skills: "Kanhaiya's tech stack:\n\n💻 **Languages**: Python, C++, JavaScript\n🤖 **AI/ML**: Machine Learning, OpenCV, YOLO, Pandas, NumPy, TensorFlow, PyTorch, LangChain\n🌐 **Web**: HTML, CSS, TailwindCSS, React, Next.js\n🔧 **Tools**: Git, GitHub, Jupyter, Google Colab, VS Code, Cloud Computing",
  experience: "💼 **Python Project Intern** — Infosys Springboard (Aug-Oct 2025)\nWorked on ML models, developed AI solutions, collaborated with cross-functional teams\n\n💼 **AI Project Intern** — Infosys Springboard (Oct-Dec 2024)\nWorked on ML models and AI solutions\n\n📄 **Research Paper Author** — IEEE Conference 2024\nPublished paper on 'AI-Driven PPE Detection and Human Access Monitoring in Manufacturing Zones' (DOI: 10.1109/11211593)",
  resume: "📄 You can view Kanhaiya's resume here: https://drive.google.com/file/d/1j3yLGFPMfGRTbqMZlFMOx5Z6e1VnyL-V/view\n\nHe's an AI/ML Engineer with experience in deep learning, computer vision, and full-stack web development.",
  github: "💻 Kanhaiya's GitHub: https://github.com/iamkanhaiyakumar\n\nHe has 51+ public repositories covering AI/ML, web development, and data science projects!",
  linkedin: "🔗 Kanhaiya's LinkedIn: https://www.linkedin.com/in/kanhaiyak0104\n\nFeel free to connect with him!",
  contact: "📱 You can reach Kanhaiya via:\n\n📧 Email: kanhaiyak0104@gmail.com\n📱 WhatsApp: +91 6206686966\n🔗 LinkedIn: linkedin.com/in/kanhaiyak0104\n💻 GitHub: github.com/iamkanhaiyakumar",
  achievements: "🏆 Kanhaiya's key achievements:\n\n📄 **IEEE Research Paper** — Published on PPE Detection using YOLO models\n🏅 **Young Turks Finalist** — 16th rank, Naukri Campus (₹10,000 award)\n🎖️ **NCC Cadet (LCPL)** — 12 MP BN Bhopal\n👨‍🏫 **GDSC Mentor** — Guided 150+ students in Google Gen AI Study Program\n🎪 **College Fest Volunteer** — Managed 10 teams, 60+ participants",
  education: "🎓 **B.Tech CSE (AI & ML)** — LNCT Excellence, Bhopal\nCGPA: 7.43 | Final year student\nSpecializing in Artificial Intelligence & Machine Learning",
  farewell: "Thanks for visiting! 😊 Feel free to come back anytime. You can also reach Kanhaiya at kanhaiyak0104@gmail.com or connect on LinkedIn. Have a great day! 👋",
  fallback: "I'm Kanhaiya's AI assistant! 🤖 I can tell you about his:\n\n• 🚀 Projects (51+ repos)\n• 🛠️ Skills (AI/ML, Web Dev)\n• 💼 Work Experience (Infosys internships)\n• 🏆 Achievements (IEEE paper, awards)\n• 📄 Resume & Contact info\n\nWhat would you like to know?",
};

function classifyOffline(question) {
  const q = question.toLowerCase().trim();

  if (/^(hi|hello|hey|hii|howdy|namaste|sup|good\s+(morning|evening|afternoon))/.test(q) && q.split(" ").length <= 5) return "greeting";
  if (/^(bye|goodbye|see\s+you|take\s+care|thank\s+you|thanks|thank\s+u|thx|ok|okay|alright|sure|got\s+it|noted|cool|great|nice|awesome|perfect)$/.test(q)) return "farewell";
  if (/resume|cv/.test(q)) return "resume";
  if (/github/.test(q)) return "github";
  if (/linkedin|linked\s?in/.test(q)) return "linkedin";
  if (/project|built|developed|portfolio/.test(q)) return "projects";
  if (/skill|tech|stack|language|tool|know/.test(q)) return "skills";
  if (/experience|intern|work|job|career/.test(q)) return "experience";
  if (/contact|email|phone|whatsapp|reach|call|number/.test(q)) return "contact";
  if (/achievement|award|certificate|ncc|ieee|paper|research|publication/.test(q)) return "achievements";
  if (/education|college|university|degree|btech|cgpa/.test(q)) return "education";
  if (/who|about|tell.*about.*him|introduce/.test(q)) return "greeting";

  return "fallback";
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hey! 👋 I'm Kanhaiya's AI assistant. Ask me anything about his projects, skills, or experience!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Check if backend is available on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          setBackendAvailable(true);
          console.log("✅ AI Backend connected");
        } else {
          setBackendAvailable(false);
        }
      } catch {
        setBackendAvailable(false);
        console.log("📴 AI Backend offline — using smart offline mode");
      }
    };
    checkBackend();
  }, []);

  // Simulate typing effect for offline responses
  const typeResponse = async (text) => {
    const words = text.split(" ");
    let current = "";
    setMessages((prev) => [...prev, { sender: "bot", text: "" }]);
    setIsTyping(false);

    for (let i = 0; i < words.length; i++) {
      current += (i === 0 ? "" : " ") + words[i];
      const snapshot = current;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "bot", text: snapshot };
        return updated;
      });
      await new Promise((r) => setTimeout(r, 25 + Math.random() * 20));
    }
  };

  const askAI = async (question) => {
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setInput("");
    setIsTyping(true);

    // Try backend first, fallback to offline
    if (backendAvailable) {
      try {
        const res = await fetch(`${API_BASE}/chat-stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });

        if (!res.ok) throw new Error("Server error");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let botText = "";

        setMessages((prev) => [...prev, { sender: "bot", text: "" }]);
        setIsTyping(false);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          botText += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { sender: "bot", text: botText };
            return updated;
          });
        }
      } catch (err) {
        setIsTyping(false);
        // Fallback to offline when backend fails
        setBackendAvailable(false);
        const intent = classifyOffline(question);
        await typeResponse(OFFLINE_RESPONSES[intent]);
      }
    } else {
      // Offline mode — smart pattern matching
      const intent = classifyOffline(question);
      await typeResponse(OFFLINE_RESPONSES[intent]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) askAI(input.trim());
  };

  const toggleChat = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.wrapper}>
      {/* Chat Toggle */}
      <button
        id="chatbot-toggle"
        className={`${styles.toggleBtn} ${isOpen ? styles.toggleOpen : ""}`}
        onClick={toggleChat}
        type="button"
        aria-label="Toggle AI Chat"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        )}
        {!isOpen && <span className={styles.togglePulse}></span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.avatar}>
                <span>🤖</span>
                <span className={`${styles.onlineDot} ${backendAvailable === false ? styles.offlineDot : ""}`}></span>
              </div>
              <div>
                <h4 className={styles.headerTitle}>Kanhaiya's AI</h4>
                <span className={styles.headerStatus}>
                  {backendAvailable ? "Online • AI Powered" : "Smart Mode • Ask anything"}
                </span>
              </div>
            </div>
            <button className={styles.headerClose} onClick={toggleChat} type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div className={styles.messages}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`${styles.msg} ${msg.sender === "user" ? styles.msgUser : styles.msgBot}`}>
                {msg.sender === "bot" && <span className={styles.msgAvi}>🤖</span>}
                <div className={styles.bubble}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className={`${styles.msg} ${styles.msgBot}`}>
                <span className={styles.msgAvi}>🤖</span>
                <div className={styles.bubble}>
                  <div className={styles.dots}><span /><span /><span /></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Chips */}
          {messages.length <= 2 && (
            <div className={styles.chips}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className={styles.chip} onClick={() => askAI(s)} type="button">{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <form className={styles.inputBar} onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className={styles.textInput}
              id="chatbot-input"
            />
            <button type="submit" className={styles.sendBtn} disabled={!input.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;