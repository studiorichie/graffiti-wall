// server.js

const express = require("express");
const path = require("path");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});
const db = admin.database();
const drawingsRef = db.ref("drawings");

// Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html when visiting "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve favicon
app.use("/favicon.ico", express.static("public/favicon.ico"));

// API Route to fetch drawings from Firebase Realtime Database
app.get("/api/drawings", async (req, res) => {
    try {
        const snapshot = await drawingsRef.once("value");
        res.json(snapshot.val() || {}); // Ensure empty object if no data exists
    } catch (error) {
        console.error("Error fetching drawings:", error);
        res.status(500).json({ error: error.message });
    }
});

// Debugging Firestore Connection (Optional)
admin.firestore().listCollections()
    .then(collections => console.log("✅ Firestore Collections:", collections.map(c => c.id)))
    .catch(err => console.error("❌ Firebase Admin Error:", err));

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
