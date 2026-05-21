const express = require('express');
const router = express.Router();
const RaceResult = require('../models/RaceResult');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const { algorithms, winner, metrics } = req.body;
    const raceResult = await RaceResult.create({
      userId: req.user._id,
      algorithms,
      winner,
      metrics
    });
    // Update user stats
    req.user.stats.totalRaces += 1;
    await req.user.save();

    res.status(201).json(raceResult);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const results = await RaceResult.find({}).populate('userId', 'name').sort({ createdAt: -1 }).limit(10);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
