import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from './Login';
import Explore from './Explore';
import Notifications from './Notifications';
import Messages from './Messages';
import Settings from './Settings';

function App() {
  return (
    <Router>
      <div>
        {/* Navigation bar */}
        <ul>
          <li><Link to="/explore">Explore</Link></li>
          <li><Link to="/notifications">Notifications</Link></li>
          <li><Link to="/messages">Messages</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <div className="profile">
            <Link to="/login">
              <button className="profilebutton">Log in</button>
            </Link>
          </div>
        </ul>

        {/* Routes */}
        <Routes>
          {/* Homepage */}
          <Route
            path="/"
            element={
              <div>
                <h1>What's Trending?</h1>
                <p>Anonymous Voices. Real Discussions</p>
                <p>Check out the latest topics and discussions happening now!</p>
                <p>Sign up and check what's happening</p>
              </div>
            }
          />

          {/* Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
