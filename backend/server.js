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




// POST /api/contact
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if(!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide name, email and message.' });
  }

  try {
    // Save to DB
    const doc = new Message({ name, email, message });
    await doc.save();

    // Configure transporter
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
      subject: `New contact from ${name}`,
      text: `You received a new message from ${name} (${email}):\n\n${message}`
    };

    // Send notification email (don't block on it — but we await to surface errors)
    await transporter.sendMail(mailOptions);

    return res.json({ ok: true });
  } catch (err) {
    console.error('Error in /api/contact:', err);
    return res.status(500).json({ error: 'Server error — please try again later.' });
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
