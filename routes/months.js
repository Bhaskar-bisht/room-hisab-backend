const express = require('express');
const router = express.Router();
const Month = require('../models/Month');
const Expense = require('../models/Expense');
const Contribution = require('../models/Contribution');

// Get all months
router.get('/', async (req, res) => {
  try {
    const months = await Month.find().sort({ startDate: -1 });
    res.json(months);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single month with full data
router.get('/:id', async (req, res) => {
  try {
    const month = await Month.findById(req.params.id);
    if (!month) return res.status(404).json({ message: 'Month not found' });

    const contributions = await Contribution.find({ monthId: req.params.id }).populate('memberId', 'name');
    const expenses = await Expense.find({ monthId: req.params.id }).populate('paidBy', 'name').sort({ date: 1 });

    const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = month.carryForward + totalContributions - totalExpenses;

    res.json({ month, contributions, expenses, totalContributions, totalExpenses, balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new month
router.post('/', async (req, res) => {
  try {
    // Check no active month exists
    const activeMonth = await Month.findOne({ status: 'active' });
    if (activeMonth) {
      return res.status(400).json({ message: 'Ek active month pehle se hai. Pehle use close karein.' });
    }

    const month = new Month({
      name: req.body.name,
      startDate: req.body.startDate,
      carryForward: req.body.carryForward || 0,
      previousMonthId: req.body.previousMonthId || null,
    });
    await month.save();
    res.status(201).json(month);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Close a month
router.put('/:id/close', async (req, res) => {
  try {
    const month = await Month.findByIdAndUpdate(
      req.params.id,
      { status: 'closed', endDate: req.body.endDate || new Date() },
      { new: true }
    );
    res.json(month);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete month (only if no data)
router.delete('/:id', async (req, res) => {
  try {
    const expenses = await Expense.countDocuments({ monthId: req.params.id });
    const contributions = await Contribution.countDocuments({ monthId: req.params.id });
    if (expenses > 0 || contributions > 0) {
      return res.status(400).json({ message: 'Month mein data hai, delete nahi ho sakta.' });
    }
    await Month.findByIdAndDelete(req.params.id);
    res.json({ message: 'Month deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
