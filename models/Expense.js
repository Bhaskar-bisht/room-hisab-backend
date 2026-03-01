const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  monthId: { type: mongoose.Schema.Types.ObjectId, ref: 'Month', required: true },
  description: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category: { 
    type: String, 
    enum: ['grocery', 'rent', 'electricity', 'other'],
    default: 'grocery'
  },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null }, // who paid if someone paid extra
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
