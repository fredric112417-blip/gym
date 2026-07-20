const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  memberName: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  month: { type: String, required: true },
  paidAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
