const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  rawText: {
    type: String,
    required: true,
  },
  analysisResult: {
    score: { type: Number, default: 0 },
    atsScore: { type: Number, default: 0 },
    strengths: [String],
    weaknesses: [String],
    skillGaps: [String],
    suggestions: [String],
    keywords: [String],
    experienceLevel: String,
    topSkills: [String],
    summary: String,
  },
  jobRole: { type: String, default: '' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resume', resumeSchema);
