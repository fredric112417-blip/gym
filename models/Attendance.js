const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  memberName: { type: String, required: true },
  personId: { type: String, default: '' },
  date: { type: String, required: true },
  checkInTime: { type: String, required: true },
  checkOutTime: { type: String, default: '' },
  status: { type: String, default: 'Checked In' },
  checkedIn: { type: Boolean, default: true },
  membershipStatus: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
