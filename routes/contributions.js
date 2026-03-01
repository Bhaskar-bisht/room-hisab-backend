const express = require('express');
const router = express.Router();
const Contribution = require('../models/Contribution');

// Get contributions for a month
router.get('/', async (req, res) => {
  try {
    const contributions = await Contribution.find({ monthId: req.query.monthId })
      .populate('memberId', 'name')
      .sort({ date: 1 });
    res.json(contributions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add contribution
router.post('/', async (req, res) => {
  try {
    const contribution = new Contribution({
      monthId: req.body.monthId,
      memberId: req.body.memberId,
      amount: req.body.amount,
      date: req.body.date,
      note: req.body.note || '',
    });
    await contribution.save();
    const populated = await contribution.populate('memberId', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update contribution
router.put('/:id', async (req, res) => {
  try {
    const contribution = await Contribution.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('memberId', 'name');
    res.json(contribution);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete contribution
router.delete('/:id', async (req, res) => {
  try {
    await Contribution.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contribution deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
