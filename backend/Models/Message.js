const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  subject: {
    type: String,
    trim: true,
    maxLength: 200,
    default: 'Contact Form Submission'
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxLength: 2000
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  },
  userAgent: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: ''
  }
});

// Index for faster queries
messageSchema.index({ createdAt: -1 });
messageSchema.index({ email: 1 });

module.exports = mongoose.model('Message', messageSchema);