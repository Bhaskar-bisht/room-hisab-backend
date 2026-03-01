const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get expenses for a month with optional date filter
router.get('/', async (req, res) => {
  try {
    const filter = { monthId: req.query.monthId };
    if (req.query.startDate && req.query.endDate) {
      filter.date = { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) };
    }
    if (req.query.category) filter.category = req.query.category;

    const expenses = await Expense.find(filter).populate('paidBy', 'name').sort({ date: 1, createdAt: 1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add expense
router.post('/', async (req, res) => {
  try {
    const expense = new Expense({
      monthId: req.body.monthId,
      description: req.body.description,
      amount: req.body.amount,
      date: req.body.date,
      category: req.body.category || 'grocery',
      paidBy: req.body.paidBy || null,
    });
    await expense.save();
    const populated = await expense.populate('paidBy', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('paidBy', 'name');
    res.json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
