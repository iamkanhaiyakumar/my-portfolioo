import { useState, useEffect, useRef } from "react";
import styles from "./Chatbot.module.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [showNotif, setShowNotif] = useState(true);

  const chatEndRef = useRef(null);

  // 🔔 Notification auto-hide
  useEffect(() => {
    const timer = setTimeout(() => setShowNotif(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // 🤖 Intro typing
  const introMessage = "Hey 👋 I'm Kanhaiya’s AI assistant.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypingText((prev) => prev + introMessage.charAt(i));
      i++;
      if (i >= introMessage.length) {
        clearInterval(interval);
        setMessages([{ type: "bot", text: introMessage }]);
      }
    }, 25);
    return () => clearInterval(interval);
  }, []);

  // 🔽 Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🤖 Ask AI
  const askAI = async () => {
    if (!question.trim()) return;

    const userMsg = { type: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      const botMsg = {
        type: "bot",
        text: data.answer,
        uiType: data.type,      // 🔥 IMPORTANT
        links: data.links || {}
      };

      setMessages((prev) => [...prev, botMsg]);

    } catch {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "⚠️ Server error" },
      ]);
    }

    setLoading(false);
    setQuestion("");
  };

  return (
    <div>
      {/* 🔔 Notification */}
      {showNotif && (
        <div
          className={styles.notification}
          onClick={() => {
            setOpen(true);
            setShowNotif(false);
          }}
        >
          👋 Kanhaiya’s AI Assistant <br />
          Ask me anything about him!
        </div>
      )}

      {/* 🤖 Floating Button */}
      <div
        className={styles.floatingBtn}
        onClick={() => setOpen(!open)}
      >
        🤖
      </div>

      {/* 💬 Chatbox */}
      {open && (
        <div className={styles.chatbox}>
          {/* Header */}
          <div className={styles.header}>
            <span>AI Assistant</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* Messages */}
          <div className={styles.messages}>
            {messages.length === 0 && (
              <div className={styles.botMsg}>{typingText}</div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.type === "user"
                    ? styles.userMsg
                    : styles.botMsg
                }
              >
                {msg.text}

                {/* 📄 Resume */}
                {msg.uiType === "resume" && (
                  <div className={styles.buttonWrapper}>
                    <a href={msg.links.resume} target="_blank">
                      <button className={styles.downloadBtn}>
                        📄 Download Resume
                      </button>
                    </a>
                  </div>
                )}

                {/* 💻 GitHub */}
                {msg.uiType === "github" && (
                  <div className={styles.buttonWrapper}>
                    <a href={msg.links.github} target="_blank">
                      <button className={styles.downloadBtn}>
                        💻 View GitHub
                      </button>
                    </a>
                  </div>
                )}

                {/* 🔗 LinkedIn */}
                {msg.uiType === "linkedin" && (
                  <div className={styles.buttonWrapper}>
                    <a href={msg.links.linkedin} target="_blank">
                      <button className={styles.downloadBtn}>
                        🔗 View LinkedIn
                      </button>
                    </a>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className={styles.typing}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className={styles.inputArea}>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about me..."
              onKeyDown={(e) => e.key === "Enter" && askAI()}
            />
            <button onClick={askAI}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
}