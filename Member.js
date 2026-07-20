const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  memberId: { type: String, unique: true, sparse: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, default: '' },
  contact: { type: String, default: '' },
  membershipType: { type: String, default: 'Basic' },
  startDate: { type: String, default: '' },
  plan: { type: String, default: 'Basic' },
  trainer: { type: String, default: 'N/A' },
  status: { type: String, default: 'Active' },
  joinedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
