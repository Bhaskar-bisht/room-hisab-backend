const mongoose = require('mongoose');

const monthSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "January 2025"
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  carryForward: { type: Number, default: 0 }, // balance carried from previous month
  previousMonthId: { type: mongoose.Schema.Types.ObjectId, ref: 'Month', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Month', monthSchema);
