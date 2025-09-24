import { useEffect, useState } from "react";
import './Explore.css';

function Explore() {
  const [entries, setEntries] = useState([]);

  // Fetch all messages from backend
  useEffect(() => {
    fetch("http://localhost:5000/entries")
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch((err) => console.error("❌ Error fetching entries:", err));
  }, []);

  return (
    <div className="page-container">
      <h1>conversations</h1>

      <div className="entries-container">
        {entries.length === 0 ? (
          <p className="no-entries">No conversations yet. Be the first to post!</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="entry">
              <p>{entry.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Explore;
