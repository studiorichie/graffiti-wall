// Ensure Firebase is loaded before execution
if (typeof firebase === "undefined") {
    console.error("❌ Firebase is NOT loaded. Check script order.");
} else {
    console.log("✅ Firebase Loaded:", firebase);
}

// Firebase Config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const drawingsRef = db.ref("drawings");

// ✅ Debugging Firebase
console.log("🔥 Firebase Loaded:", firebase);

// Auto-clear canvas every hour
setInterval(() => drawingsRef.remove(), 3600000);

// Basic Interactive Graffiti Board Prototype
const canvas = document.getElementById("graffitiCanvas");
const ctx = canvas.getContext("2d");
let drawing = false;
let color = "#ff0000"; // Default red
let size = 5;

canvas.width = window.innerWidth * 2; // Wide canvas for scrolling effect
canvas.height = window.innerHeight;

// Listen for new drawings in Firebase
drawingsRef.on("child_added", (snapshot) => {
    const data = snapshot.val();
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.size;
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
});

// Mouse Events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);

// Touch Events
canvas.addEventListener("touchstart", (e) => startDrawing(e.touches[0]));
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchmove", (e) => draw(e.touches[0]));

function startDrawing(e) {
    drawing = true;
    draw(e); // Draw the first point
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!drawing) return;

    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);

    // Store drawing data in Firebase
    const drawData = {
        x: e.clientX,
        y: e.clientY,
        color: color,
        size: size
    };
    drawingsRef.push(drawData);
}

// Color and Size Controls
function setColor(newColor) {
    color = newColor;
}
function setSize(newSize) {
    size = newSize;
}

// Save Canvas
function saveDrawing() {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "graffiti.png";
    link.click();
}

// Clear Canvas (Admin Control)
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawingsRef.remove(); // Clears for everyone
}
