const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static('public'));

// Routes
const authRoutes = require('./routes/authRoutes');
const syllabusRoutes = require('./routes/syllabusRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const testRoutes = require('./routes/testRoutes');
const extractionRoutes = require('./routes/extractionRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Basic health route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

app.get("/test-gemini", async (req, res) => {
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });

    const result = await model.generateContent("Say hello");
    const response = await result.response;

    res.json({ output: response.text() });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/test', testRoutes);
app.use('/api/extract', extractionRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;
