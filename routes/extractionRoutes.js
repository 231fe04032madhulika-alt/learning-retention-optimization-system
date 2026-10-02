const express = require('express');
const router = express.Router();
const { upload, extractText } = require('../controllers/extractionController');

// Define route
router.post('/', upload.single('syllabusFile'), extractText);

module.exports = router;
