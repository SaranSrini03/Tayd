// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  // Add other fields as needed
});

module.exports = mongoose.model('User', userSchema);
