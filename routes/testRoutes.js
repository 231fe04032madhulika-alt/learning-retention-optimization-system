const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const testController = require('../controllers/testController');

// @route   GET /api/test/beginner
// @desc    Get beginner test
// @access  Private
router.get('/beginner', auth, testController.getBeginnerTest);

// @route   GET /api/test/intermediate
// @desc    Get intermediate test
// @access  Private
router.get('/intermediate', auth, testController.getIntermediateTest);

// @route   GET /api/test/advanced
// @desc    Get advanced test
// @access  Private
router.get('/advanced', auth, testController.getAdvancedTest);

// @route   POST /api/test/submit
// @desc    Submit mock test
// @access  Private
router.post('/submit', auth, testController.submitTest);

module.exports = router;
