const User = require('../models/User');
const StudySchedule = require('../models/StudySchedule');
const Syllabus = require('../models/Syllabus');
const MockTest = require('../models/MockTest');
const TestResult = require('../models/TestResult');

const getSystemStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments({ role: 'user' });
        const adminCount = await User.countDocuments({ role: 'admin' });
        const syllabusCount = await Syllabus.countDocuments();
        const scheduleCount = await StudySchedule.countDocuments();
        const testResultCount = await TestResult.countDocuments();
        const mockTestCacheCount = await MockTest.countDocuments();

        res.json({
            users: userCount,
            admins: adminCount,
            syllabuses: syllabusCount,
            schedules: scheduleCount,
            testResults: testResultCount,
            mockTestGenerations: mockTestCacheCount
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Cascade delete
        await StudySchedule.deleteMany({ userId: id });
        await Syllabus.deleteMany({ userId: id });
        await TestResult.deleteMany({ userId: id });
        await User.findByIdAndDelete(id);

        res.json({ message: 'User and all associated data deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllSyllabuses = async (req, res) => {
    try {
        const syllabuses = await Syllabus.find().populate('userId', 'email name').sort({ createdAt: -1 });
        res.json(syllabuses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteSyllabus = async (req, res) => {
    try {
        await Syllabus.findByIdAndDelete(req.params.id);
        res.json({ message: 'Syllabus deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllSchedules = async (req, res) => {
    try {
        const schedules = await StudySchedule.find().populate('userId', 'email name').sort({ scheduledTime: 1 });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteSchedule = async (req, res) => {
    try {
        await StudySchedule.findByIdAndDelete(req.params.id);
        res.json({ message: 'Schedule deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllMockTests = async (req, res) => {
    try {
        // Exclude questions array to keep payload small, just show metadata
        const tests = await MockTest.find().select('-questions').sort({ createdAt: -1 });
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteMockTest = async (req, res) => {
    try {
        await MockTest.findByIdAndDelete(req.params.id);
        res.json({ message: 'Mock Test cache deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getSystemStats,
    getAllUsers,
    deleteUser,
    getAllSyllabuses,
    deleteSyllabus,
    getAllSchedules,
    deleteSchedule,
    getAllMockTests,
    deleteMockTest
};
