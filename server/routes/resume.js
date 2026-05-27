const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const authMiddleware = require('../middleware/auth');
const Resume = require('../models/Resume');
const { analyzeResume } = require('../services/gemini');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

// POST /api/resume/upload
router.post('/upload', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    // Extract text from PDF
    let pdfData;
    try {
      pdfData = await pdfParse(req.file.buffer);
    } catch (pdfErr) {
      return res.status(422).json({ message: 'Could not parse PDF. Please ensure it is a text-based PDF.' });
    }

    const rawText = pdfData.text.trim();
    if (!rawText || rawText.length < 50) {
      return res.status(422).json({ message: 'PDF appears to be empty or image-based. Please use a text-based PDF.' });
    }

    // Analyze with Gemini
    const analysisResult = await analyzeResume(rawText);

    // Save to database
    const resume = new Resume({
      userId: req.userId,
      fileName: req.file.originalname,
      rawText,
      analysisResult,
    });
    await resume.save();

    res.status(201).json({
      message: 'Resume analyzed successfully',
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        analysisResult: resume.analysisResult,
        createdAt: resume.createdAt,
      },
    });
  } catch (err) {
    console.error('Resume upload error:', err);
    
    if (err.status === 429) {
      return res.status(503).json({
        message: 'API quota exceeded. Please try again in a few moments.',
        retryAfter: err.errorDetails?.find(d => d['@type']?.includes('RetryInfo'))?.retryDelay || '10s',
      });
    }
    
    res.status(500).json({ message: 'Failed to analyze resume. Please try again.' });
  }
});

// GET /api/resume/history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId })
      .select('-rawText')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ resumes });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ message: 'Failed to fetch resume history' });
  }
});

// GET /api/resume/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json({ resume });
  } catch (err) {
    console.error('Get resume error:', err);
    res.status(500).json({ message: 'Failed to fetch resume' });
  }
});

module.exports = router;
