const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  category: { type: String, enum: ['Technical', 'Behavioral', 'Situational', 'General'] },
  modelAnswer: String,
});

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  jobRole: {
    type: String,
    required: true,
  },
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Interview', interviewSchema);
