const mongoose = require('mongoose');

const raceResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  algorithms: [{ type: String }],
  winner: { type: String },
  metrics: [{
    algorithmName: { type: String },
    timeTaken: { type: Number },
    comparisons: { type: Number },
    swaps: { type: Number }
  }]
}, { timestamps: true });

const RaceResult = mongoose.model('RaceResult', raceResultSchema);
module.exports = RaceResult;
