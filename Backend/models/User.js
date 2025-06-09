const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'tecnic', 'basic'], default: 'basic' }
});
module.exports = mongoose.model('User', userSchema);
