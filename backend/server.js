require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const nodemailer = require('nodemailer');
const cors = require('cors');




const Message = require('./Models/Message');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Serve frontend if placed inside backend/public
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("MongoDB connection error:", err));

document.getElementById("contact-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  try {
    const response = await fetch(`/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    const result = await response.json();
    if (result.ok) {
      alert("Message sent successfully!");
      e.target.reset();
    } else {
      alert("Error: " + (result.error || "Something went wrong."));
    }
  } catch (err) {
    console.error("Network error:", err);
    alert("Network error. Please try again later.");
  }
});
// (Optional) simple GET to check server status
app.get('/api/ping', (req, res) => res.json({ ok: true, time: new Date() }));

// fallback to index.html for other routes if frontend is served from backend/public
app.get('*', (req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  if (req.method === 'GET' && fsExists(indexPath)) return res.sendFile(indexPath);
  return res.status(404).json({ error: 'Not found' });
});

// helper to check fs exists synchronously (small util)
const fs = require('fs');
function fsExists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Server listening on port ${PORT}`));
