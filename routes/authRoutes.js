const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', authController.signup);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

const auth = require('../middleware/authMiddleware');

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, authController.getUserProfile);

// @route   PUT /api/auth/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', auth, authController.updateProfile);

// @route   POST /api/auth/change-password
router.post('/change-password', auth, authController.changePassword);

// @route   POST /api/auth/request-email-change
router.post('/request-email-change', auth, authController.requestEmailChange);

// @route   POST /api/auth/verify-email-change
router.post('/verify-email-change', auth, authController.verifyEmailChange);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset OTP
// @access  Public
router.post('/forgot-password', authController.requestPasswordReset);

// @route   POST /api/auth/reset-password
// @desc    Reset password with OTP
// @access  Public
router.post('/reset-password', authController.resetPasswordWithOtp);

module.exports = router;
