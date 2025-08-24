// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');

const Message = require('./Models/Message');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend from public folder
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));


// POST /api/contact (save message + send email)
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Please provide name, email, subject, and message." });
  }

  try {
    // Save to MongoDB
    const doc = new Message({ name, email, subject, message });
    await doc.save();

    // Send email notification
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `Portfolio Contact <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `New Contact: ${subject} from ${name}`,
      text: `You received a new message:\n\nFrom: ${name} (${email})\nSubject: ${subject}\n\nMessage:\n${message}`
    };

    await transporter.sendMail(mailOptions);

    return res.json({ ok: true });
  } catch (err) {
    console.error("Error in /api/contact:", err);
    return res.status(500).json({ error: "Server error — please try again later." });
  }
});

// Health check
app.get('/api/ping', (req, res) => res.json({ ok: true, time: new Date() }));

// Fallback: serve index.html
app.get('*', (req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  if (req.method === 'GET' && fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.status(404).json({ error: "Not found" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
