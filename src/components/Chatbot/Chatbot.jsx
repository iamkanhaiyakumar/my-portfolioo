import React, { useState, useRef, useEffect } from "react";
import styles from "./Chatbot.module.css";

const SUGGESTIONS = [
  "Tell me about your IEEE paper",
  "What is DeadlineAI?",
  "What are your skills?",
  "Accenture Gold Contest",
  "Show me your resume",
];

// Use environment variable for backend URL, fallback to localhost for dev
const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV
    ? "http://localhost:8000"
    : "https://my-portfolioo-hs8y.onrender.com");

// Offline knowledge base for when backend is unavailable
// Offline knowledge base for when backend is unavailable
const OFFLINE_RESPONSES = {
  greeting: "Hey there! 👋 I'm Kanhaiya's AI assistant. He's an aspiring AI/ML Engineer from Bhopal, India — B.Tech CSE (AI & ML) at LNCT Excellence with CGPA 7.43. Ask me about his projects, skills, or experience!",
  how_are_you: "I'm doing great, thank you for asking! 😊 I'm Kanhaiya's AI assistant, ready to help you explore his projects, skills, or experience. What can I help you find today?",
  deadline_ai: "🚀 **DeadlineAI** is Kanhaiya's automated academic task scheduler. It scans notice boards or syllabi using OCR (Optical Character Recognition), extracts task deadlines using Generative AI, and automatically schedules calendar timeline reminders on the user's dashboard.",
  ppe_detection: "🛡️ **PPE Kit Detection System** is Kanhaiya's industrial safety project. It uses a custom YOLOv8/v9 deep learning model trained on 3,000+ images to detect protective helmets, safety vests, and boots in manufacturing zones with 92% accuracy, triggering real-time OpenCV alerts. This research was published in an IEEE conference.",
  mock_interview: "🗣️ **AI Mock Interview Platform** is a TypeScript and Next.js application that simulates real-world job interviews. It records screen/audio, transcripts speech-to-text, and uses Gemini API to evaluate candidate answers, grading core performance metrics and providing detailed, personalized feedback.",
  accenture_contest: "🥇 Kanhaiya unlocked the prestigious **Gold Level** in Accenture's **iAspire 'Go for Gold' contest**, recognizing his outstanding technical performance, coding ability, and engineering potential.",
  git_explain: "📌 **Git** is a distributed version control system that tracks changes in source code during software development. **GitHub** is a cloud-based hosting service that lets developers store, manage, and collaborate on their Git repositories. Kanhaiya uses Git and GitHub to manage all of his 51+ public repositories!\n\nFeel free to explore Kanhaiya's GitHub profile:\n\n[Open GitHub](https://github.com/iamkanhaiyakumar)",
  current_status: "🎓 Kanhaiya is currently a B.Tech CSE (AI & ML) student in his final year at LNCT Excellence, Bhopal. He is serving as a Technical Reviewer for the IEEE DECoN 2025 conference, building deep learning and generative AI projects, and actively seeking opportunities as an AI/ML Engineer or Python Developer!",
  projects: "Kanhaiya has built 51+ projects! Key ones include:\n\n🔹 **PPE Kit Detection** — YOLOv8/v9 based safety detection (92% accuracy), IEEE published\n🔹 **AI Content Generator** — Next.js + TypeScript platform using LLM APIs\n🔹 **AI Resume Analyzer** — NLP-based resume parsing & skill matching\n🔹 **Book Recommender** — ML-based collaborative filtering system\n🔹 **Weather App** — Real-time weather using OpenWeather API\n🔹 **AI Mock Interview** — AI-powered interview simulation platform\n\nCheck out all of his repositories:\n\n[Open GitHub](https://github.com/iamkanhaiyakumar)",
  skills: "Kanhaiya's tech stack:\n\n💻 **Languages**: Python, C++, JavaScript\n🤖 **AI/ML**: Machine Learning, OpenCV, YOLO, Pandas, NumPy, TensorFlow, PyTorch, LangChain\n🌐 **Web**: HTML, CSS, TailwindCSS, React, Next.js\n🔧 **Tools**: Git, GitHub, Jupyter, Google Colab, VS Code, Cloud Computing",
  experience: "💼 **Python Project Intern** — Infosys Springboard (Aug-Oct 2025)\n• Developed modular Python scripts to automate data collection and preprocessing.\n• Implemented OOP patterns to reduce code redundancy by 20%.\n• Performed EDA using Pandas, NumPy, and Matplotlib.\n\n[View Python Intern Certificate](/certificates/infosys_python.pdf)\n\n💼 **AI Project Intern** — Infosys Springboard (Oct-Dec 2024)\n• Trained custom YOLO safety kit compliance model on 3,000+ images.\n• Achieved 92% detection accuracy and built OpenCV real-time alerts.\n\n[View AI Intern Certificate](/certificates/infosys_ai.pdf)\n\n📄 **Research Paper Author** — IEEE Conference 2024\n• Published paper on 'AI-Driven PPE Detection and Human Access Monitoring' (DOI: 10.1109/11211593).\n\n[View Research Paper](/certificates/ieee_decon.pdf)",
  resume: "📄 You can view Kanhaiya's resume here:\n\n[Download Resume](/Kanhaiya-Kumar-Resume.pdf)\n\nHe's an AI/ML Engineer with experience in deep learning, computer vision, and full-stack web development.",
  github: "💻 Kanhaiya's GitHub:\n\n[Open GitHub](https://github.com/iamkanhaiyakumar)\n\nHe has 51+ public repositories covering AI/ML, web development, and data science projects!",
  linkedin: "🔗 Kanhaiya's LinkedIn:\n\n[Open LinkedIn](https://www.linkedin.com/in/kanhaiyak0104)\n\nFeel free to connect with him!",
  contact: "📱 You can reach Kanhaiya via:\n\n📧 Email: [Send Email](mailto:kanhaiyak0104@gmail.com)\n📱 WhatsApp: [Chat on WhatsApp](https://wa.me/916206686966)\n🔗 LinkedIn: [Open LinkedIn](https://www.linkedin.com/in/kanhaiyak0104)\n💻 GitHub: [Open GitHub](https://github.com/iamkanhaiyakumar)",
  achievements: "🏆 Kanhaiya's key achievements:\n\n🌐 **IEEE DECoN 2025 Reviewer** — Selected as a Technical Reviewer for the IEEE International Conference on Data, Energy and Communication Networks\n🥇 **Accenture iAspire Winner** — Unlocked Gold Level in Accenture's iAspire contest\n\n[View Accenture Certificate](/certificates/accenture.pdf)\n\n📄 **IEEE Research Paper** — Published paper on PPE Detection using YOLO models\n\n[View Research Paper](/certificates/ieee_decon.pdf)\n\n🏅 **Young Turks Finalist** — 16th rank, Naukri Campus (₹10,000 award)\n\n🎖️ **NCC Cadet (LCPL)** — 12 MP BN Bhopal\n\n[View NCC Certificate](/certificates/ncc.pdf)\n\n👨‍🏫 **GDSC Mentor** — Guided 150+ students in Google Gen AI Study Program",
  education: "🎓 **B.Tech CSE (AI & ML)** — LNCT Excellence, Bhopal\nCGPA: 7.43 | Final year student\nSpecializing in Artificial Intelligence & Machine Learning",
  farewell: "Thanks for visiting! 😊 Feel free to come back anytime. You can also reach Kanhaiya via email or LinkedIn. Have a great day! 👋\n\n[Send Email](mailto:kanhaiyak0104@gmail.com)\n\n[Open LinkedIn](https://www.linkedin.com/in/kanhaiyak0104)",
  fallback: "I'm Kanhaiya's AI assistant! 🤖 I can tell you about his:\n\n• 🚀 Projects (51+ repos)\n• 🛠️ Skills (AI/ML, Web Dev)\n• 💼 Work Experience (Infosys internships)\n• 🏆 Achievements (IEEE paper, awards)\n• 📄 Resume & Contact info\n\nWhat would you like to know?",
};

const renderMessageText = (text) => {
  if (!text) return "";

  // Split by newlines first
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    // Regex to tokenise bold (**text**), markdown links ([label](url)), and plain URLs
    const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\)|\bhttps?:\/\/\S+|\b\/[a-zA-Z0-9_\-\.\/]+\.pdf)/g;
    const tokens = line.split(regex);

    const lineContent = tokens.map((token, tokenIdx) => {
      if (token.startsWith("**") && token.endsWith("**")) {
        return <strong key={tokenIdx}>{token.slice(2, -2)}</strong>;
      }
      if (token.startsWith("[") && token.includes("](")) {
        const match = token.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          return (
            <a
              key={tokenIdx}
              href={match[2]}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.msgLinkButton}
            >
              {match[1]}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: "6px", display: "inline-block", verticalAlign: "middle" }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          );
        }
      }
      if (/^https?:\/\/\S+$/.test(token) || (token.startsWith("/") && token.endsWith(".pdf"))) {
        return (
          <a
            key={tokenIdx}
            href={token}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.msgLinkButton}
          >
            {token.startsWith("/") ? "View PDF" : "Open Link"}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: "6px", display: "inline-block", verticalAlign: "middle" }}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        );
      }
      return token;
    });

    return (
      <React.Fragment key={lineIdx}>
        {lineContent}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
};

function classifyOffline(question) {
  const q = question.toLowerCase().trim();

  if (/^(hi|hello|hey|hii|howdy|namaste|sup|good\s+(morning|evening|afternoon))/.test(q) && q.split(" ").length <= 5) return "greeting";
  if (/how\s+are\s+you|how\s+r\s+u|how\s+are\s+u|hows\s+it\s+going|how's\s+it\s+going|how\s+do\s+you\s+do/.test(q)) return "how_are_you";
  if (/^(bye|goodbye|see\s+you|take\s+care|thank\s+you|thanks|thank\s+u|thx|ok|okay|alright|sure|got\s+it|noted|cool|great|nice|awesome|perfect)$/.test(q)) return "farewell";
  if (/deadline/.test(q)) return "deadline_ai";
  if (/ppe|safety|helmet/.test(q)) return "ppe_detection";
  if (/interview|mock/.test(q)) return "mock_interview";
  if (/accenture|iaspire|gold/.test(q)) return "accenture_contest";
  if (/what\s+is\s+git|explain\s+git|definition\s+of\s+git|what\s+is\s+github|explain\s+github/.test(q)) return "git_explain";
  if (/currently\s+doing|doing\s+currently|current\s+status|nowadays/.test(q)) return "current_status";
  if (/resume|cv/.test(q)) return "resume";
  if (/github|git\b/.test(q)) return "github";
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
  const [activeApi, setActiveApi] = useState(API_BASE);
  const [speakingText, setSpeakingText] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Cancel voice on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    if (speakingText === text) {
      setSpeakingText(null);
      return;
    }

    const cleanText = text
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[^\w\s\d.,!?\u00c0-\u00ff]/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith("en-") && v.name.includes("Google"))
      || voices.find(v => v.lang.startsWith("en-"))
      || voices[0];

    if (englishVoice) utterance.voice = englishVoice;
    utterance.rate = 1.05;

    utterance.onend = () => setSpeakingText(null);
    utterance.onerror = () => setSpeakingText(null);

    setSpeakingText(text);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Check if backend is available on mount (with auto failover from local to production)
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          setBackendAvailable(true);
          setActiveApi(API_BASE);
          console.log("✅ AI Backend connected:", API_BASE);
          return;
        }
      } catch (err) {
        console.log("⚠️ Local backend offline, checking production fallback...");
      }

      // If local dev backend failed, fall back to production deployed backend
      if (API_BASE.includes("localhost") || API_BASE.includes("127.0.0.1")) {
        try {
          const PROD_URL = "https://my-portfolioo-hs8y.onrender.com";
          const res = await fetch(`${PROD_URL}/health`, { signal: AbortSignal.timeout(4000) });
          if (res.ok) {
            setBackendAvailable(true);
            setActiveApi(PROD_URL);
            console.log("✅ AI Production Backend connected:", PROD_URL);
            return;
          }
        } catch (err) {
          console.log("📴 Production backend fallback offline too");
        }
      }

      setBackendAvailable(false);
      console.log("📴 AI Backend offline — using smart offline mode");
    };
    checkBackend();
  }, []);

  // Simulate typing effect for offline responses
  const typeResponse = async (text) => {
    setIsTyping(false);
    if (!text) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I'm Kanhaiya's AI assistant! 🤖 Ask me about his projects, skills, or experience — I'm ready to help!",
        },
      ]);
      return;
    }
    const words = text.split(" ");
    let current = "";
    setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

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

    // If we already know the backend is offline, go straight to local fallback (0 latency!)
    if (backendAvailable === false) {
      setIsTyping(false);
      const intent = classifyOffline(question);
      await typeResponse(OFFLINE_RESPONSES[intent]);
      return;
    }

    // 1. Try current active API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${activeApi}/chat-stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error("Server error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botText = "";

      setMessages((prev) => [...prev, { sender: "bot", text: "" }]);
      setIsTyping(false);
      setBackendAvailable(true);

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
      return;
    } catch (err) {
      console.log("⚠️ Active API request failed, trying production backend fallback...");
    }

    // 2. Failover to production API if active API was localhost
    if (activeApi.includes("localhost") || activeApi.includes("127.0.0.1")) {
      try {
        const PROD_URL = "https://my-portfolioo-hs8y.onrender.com";
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s for spin up

        const res = await fetch(`${PROD_URL}/chat-stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) throw new Error("Production server error");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let botText = "";

        setMessages((prev) => [...prev, { sender: "bot", text: "" }]);
        setIsTyping(false);
        setBackendAvailable(true);
        setActiveApi(PROD_URL); // upgrade active API to production

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
        return;
      } catch (err) {
        console.log("📴 Production backend fallback failed too");
      }
    }

    // 3. True Offline fallback
    setIsTyping(false);
    setBackendAvailable(false);
    const intent = classifyOffline(question);
    await typeResponse(OFFLINE_RESPONSES[intent]);
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
                  {renderMessageText(msg.text)}
                  {msg.sender === "bot" && msg.text && (
                    <button
                      className={`${styles.speakBtn} ${speakingText === msg.text ? styles.speaking : ""}`}
                      onClick={() => handleSpeak(msg.text)}
                      type="button"
                      title={speakingText === msg.text ? "Stop speaking" : "Speak message"}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      </svg>
                    </button>
                  )}
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