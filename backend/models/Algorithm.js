const mongoose = require('mongoose');

const algorithmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // Sorting, Searching, Graph, DP
  complexity: {
    best: { type: String, required: true },
    avg: { type: String, required: true },
    worst: { type: String, required: true },
    space: { type: String, required: true }
  },
  description: { type: String, required: true },
  pseudocode: { type: String, required: true },
  implementations: {
    python: { type: String },
    java: { type: String },
    cpp: { type: String }
  }
}, { timestamps: true });

const Algorithm = mongoose.model('Algorithm', algorithmSchema);
module.exports = Algorithm;
