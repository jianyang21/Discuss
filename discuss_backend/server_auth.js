const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Load Firebase credentials
const serviceAccount = require("./discuss-57858-firebase-adminsdk-fbsvc-8d88fac979.json");

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const usersCollection = db.collection("users");

// 🔹 Use secret key from .env
const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret";


// ==========================
// 🔐 Middleware: Verify Token
// ==========================
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}


// ==========================
// 🟢 REGISTER
// ==========================
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Username & password required" });

    // Check if user already exists
    const userSnapshot = await usersCollection.where("username", "==", username).get();
    if (!userSnapshot.empty)
      return res.status(400).json({ error: "User already exists" });

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Save user in Firestore
    const newUser = {
      username,
      password: hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await usersCollection.add(newUser);
    res.status(201).json({ id: docRef.id, username });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ error: error.message });
  }
});


// ==========================
// 🟢 LOGIN
// ==========================
// ==========================
// 🟢 LOGIN
// ==========================
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const snapshot = await usersCollection.where("username", "==", username).get();
    if (snapshot.empty) {
      return res.status(400).json({ success: false, error: "User not found" });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    // Compare password with hashed password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: "Invalid password" });
    }

    // Generate JWT if password is correct
    const token = jwt.sign(
      { id: userDoc.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});


// ==========================
// 🟢 PROTECTED ROUTE (Example)
// ==========================
app.get("/profile", verifyToken, async (req, res) => {
  res.json({
    message: "Profile data accessed",
    user: req.user,
  });
});


// ==========================
// 🚀 Start Server
// ==========================
const PORT = 5001;
app.listen(PORT, () => console.log(`🔑 Auth server running on http://localhost:${PORT}`));
