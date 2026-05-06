import React, { useState, useRef, useEffect } from "react";
import styles from "./Chatbot.module.css";

const SUGGESTIONS = [
  "Tell me about his projects",
  "What are his skills?",
  "Show resume",
  "Work experience",
  "GitHub profile",
];

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

  const askAI = async (question) => {
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8000/chat-stream", {
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
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I'm having trouble connecting to the AI backend. Please make sure the backend server is running on port 8000. 🔄",
        },
      ]);
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
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
                <span className={styles.onlineDot}></span>
              </div>
              <div>
                <h4 className={styles.headerTitle}>Kanhaiya's AI</h4>
                <span className={styles.headerStatus}>Online • Ask anything</span>
              </div>
            </div>
            <button className={styles.headerClose} onClick={toggleChat} type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
                  <div className={styles.dots}><span/><span/><span/></div>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;