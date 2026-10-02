const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const syllabusController = require('../controllers/syllabusController');

// @route   POST /api/syllabus/upload
// @desc    Upload Syllabus
// @access  Private
router.post('/upload', auth, syllabusController.uploadSyllabus);

module.exports = router;
