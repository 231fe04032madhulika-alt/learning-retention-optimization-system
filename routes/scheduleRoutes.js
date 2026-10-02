const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const scheduleController = require('../controllers/scheduleController');

// @route   POST /api/schedule/generate
// @desc    Generate study plan
// @access  Private
router.post('/generate', auth, scheduleController.generateSchedule);

// @route   GET /api/schedule/today
// @desc    Get today's topics
// @access  Private
router.get('/today', auth, scheduleController.getTodaySchedule);

// @route   POST /api/schedule/done
// @desc    Mark topic done
// @access  Private
router.post('/done', auth, scheduleController.markTopicDone);

module.exports = router;
