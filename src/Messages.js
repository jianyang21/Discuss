import { useState } from "react";
import './Messages.css';

function Messages() {
  const [message, setMessage] = useState("");

  const handlePost = async () => {
    if (message.trim() === "") return;
    try {
      const res = await fetch("http://localhost:5000/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Failed to save message");
      }

      setMessage(""); // clear input after posting
    } catch (err) {
      console.error("❌ Error posting message:", err);
    }
  };

  return (
    <div className="page-container">
      <h2>Share Your Anonymous Message</h2>

      <div className="message-box">
        <textarea
          placeholder="Write something anonymously..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="post-btn" onClick={handlePost}>
          Post
        </button>
      </div>
    </div>
  );
}

export default Messages;
