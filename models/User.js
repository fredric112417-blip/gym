const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'coach', 'member'], default: 'member' },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  address: { type: String, default: '' },
  goal: { type: String, enum: ['weight gain', 'weight loss', 'general'], default: 'general' },
  package: { type: String, enum: ['12 month', '6 month', '1 month'], default: '1 month' },
  fees: { type: Number, default: 0 },
  coachRequested: { type: Boolean, default: false },
  coachFee: { type: Number, default: 0 },
  memberId: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
