const express = require('express');
const authMiddleware = require('../middleware/auth');
const Resume = require('../models/Resume');
const Interview = require('../models/Interview');
const { generateInterviewQuestions } = require('../services/gemini');

const router = express.Router();

// POST /api/interview/generate
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { resumeId, jobRole } = req.body;

    if (!resumeId || !jobRole) {
      return res.status(400).json({ message: 'Resume ID and job role are required' });
    }

    const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Generate questions via Gemini
    const questions = await generateInterviewQuestions(resume.rawText, jobRole);

    // Save interview session
    const interview = new Interview({
      userId: req.userId,
      resumeId,
      jobRole,
      questions,
    });
    await interview.save();

    res.status(201).json({
      message: 'Interview questions generated successfully',
      interview: {
        id: interview._id,
        jobRole: interview.jobRole,
        questions: interview.questions,
        createdAt: interview.createdAt,
      },
    });
  } catch (err) {
    console.error('Interview generate error:', err);
    res.status(500).json({ message: 'Failed to generate interview questions. Please try again.' });
  }
});

// GET /api/interview/:resumeId — get latest interview for a resume
router.get('/:resumeId', authMiddleware, async (req, res) => {
  try {
    const interviews = await Interview.find({
      resumeId: req.params.resumeId,
      userId: req.userId,
    }).sort({ createdAt: -1 }).limit(5);

    res.json({ interviews });
  } catch (err) {
    console.error('Get interview error:', err);
    res.status(500).json({ message: 'Failed to fetch interview sessions' });
  }
});

module.exports = router;
