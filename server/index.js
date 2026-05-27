const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const interviewRoutes = require('./routes/interview');

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed CORS origins — extend via ALLOWED_ORIGINS env var (comma-separated)
const DEFAULT_ORIGINS = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000'];
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? [...DEFAULT_ORIGINS, ...process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())]
  : DEFAULT_ORIGINS;

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Resume Analyzer API is running', timestamp: new Date().toISOString() });
});

// 404 catch-all for unknown /api/* routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Multer & file-type errors — return JSON instead of default HTML error page
app.use((err, req, res, next) => {
  // Multer errors (e.g. wrong file type, file too large)
  if (err.name === 'MulterError' || (err.message && err.message.toLowerCase().includes('only pdf'))) {
    return res.status(400).json({ message: err.message || 'File upload error' });
  }
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

