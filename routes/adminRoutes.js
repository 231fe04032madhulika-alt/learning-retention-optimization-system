const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');
const { 
    getSystemStats, 
    getAllUsers, 
    deleteUser,
    getAllSyllabuses,
    deleteSyllabus,
    getAllSchedules,
    deleteSchedule,
    getAllMockTests,
    deleteMockTest
} = require('../controllers/adminController');

// All routes require valid JWT AND Admin role
router.use(auth);
router.use(adminAuth);

// @route   GET /api/admin/stats
router.get('/stats', getSystemStats);

// @route   GET /api/admin/users
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// @route   Syllabuses
router.get('/syllabuses', getAllSyllabuses);
router.delete('/syllabuses/:id', deleteSyllabus);

// @route   Schedules
router.get('/schedules', getAllSchedules);
router.delete('/schedules/:id', deleteSchedule);

// @route   Mock Tests
router.get('/mocktests', getAllMockTests);
router.delete('/mocktests/:id', deleteMockTest);

module.exports = router;
