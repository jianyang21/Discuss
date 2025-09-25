const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase using environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  })
});

console.log("Firebase initialized successfully!");

const db = admin.firestore();
const entriesCollection = db.collection("entries");

// 🟢 POST route
app.post("/entries", async (req, res) => {
  console.log("📥 Received body:", req.body);
  try {
    const { text } = req.body;
    if (!text) {
      console.log("⚠️ No text provided!");
      return res.status(400).json({ error: "Text is required" });
    }

    const newEntry = {
      text,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await entriesCollection.add(newEntry);
    console.log("✅ Saved entry with ID:", docRef.id);
    res.status(201).json({ id: docRef.id, ...newEntry });
  } catch (error) {
    console.error("❌ Error saving entry:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🟢 GET route
app.get("/entries", async (req, res) => {
  try {
    const snapshot = await entriesCollection
      .orderBy("createdAt", "desc")
      .get();

    const entries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`📤 Sending ${entries.length} entries`);
    res.json(entries);
  } catch (error) {
    console.error("❌ Error fetching entries:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

