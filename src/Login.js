import './Login.css';
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const validateLogin = async () => {
    try {
      const res = await fetch("http://localhost:5001/login", {   // <-- your backend port
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ " + data.message);
        localStorage.setItem("token", data.token); // save token for later
        navigate("/");
      } else {
        alert("❌ " + data.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("⚠️ Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <div className="loginbox">
        <h4>Enter your Details</h4>
        <input
          type="text"
          placeholder="Enter your account name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="Login" onClick={validateLogin}>
          Log in
        </button>
        <Link className="Forgot" to="/forgot-password">
          Forgotten Password?
        </Link>
      </div>
    </div>
  );
}

export default Login;
