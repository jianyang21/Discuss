const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin using your uploaded JSON
const serviceAccount = require("./discuss-57858-firebase-adminsdk-fbsvc-8d88fac979.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
