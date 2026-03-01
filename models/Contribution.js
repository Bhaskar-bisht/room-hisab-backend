const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  monthId: { type: mongoose.Schema.Types.ObjectId, ref: 'Month', required: true },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  note: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Contribution', contributionSchema);
