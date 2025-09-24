import { useState } from "react";
import './Pages.css';

function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState("public");

  return (
    <div className="page-container">
      <h2>Settings</h2>

      <div className="settings-item">
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          Enable Dark Mode
        </label>
      </div>

      <div className="settings-item">
        <label>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
          Enable Notifications
        </label>
      </div>

      <div className="settings-item">
        <label>
          Privacy:
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </label>
      </div>

      <div className="settings-summary">
        <h3>Summary</h3>
        <p><strong>Dark Mode:</strong> {darkMode ? "On" : "Off"}</p>
        <p><strong>Notifications:</strong> {notifications ? "Enabled" : "Disabled"}</p>
        <p><strong>Privacy:</strong> {privacy}</p>
      </div>
    </div>
  );
}

export default Settings;
