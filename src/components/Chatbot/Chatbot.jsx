import { useState } from "react";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("https://your-backend-url/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: input })
      });

      const data = await res.json();

      const botMsg = { role: "bot", text: data.answer };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    }

    setInput("");
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "320px",
      background: "#0f172a",
      color: "#fff",
      padding: "12px",
      borderRadius: "12px",
      boxShadow: "0 0 10px rgba(0,0,0,0.5)"
    }}>
      <h4>Ask Me 🤖</h4>

      <div style={{
        maxHeight: "200px",
        overflowY: "auto",
        fontSize: "14px"
      }}>
        {messages.map((msg, i) => (
          <p key={i}>
            <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.text}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about me..."
        style={{ width: "100%", marginTop: "5px" }}
      />

      <button onClick={handleSend} style={{ width: "100%", marginTop: "5px" }}>
        Send
      </button>
    </div>
  );
};

export default Chatbot;