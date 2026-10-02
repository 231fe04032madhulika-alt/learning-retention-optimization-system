const User = require('../models/User');
const Syllabus = require('../models/Syllabus');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail, sendOtpEmail } = require('../services/emailService');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
    try {
        const { name, password, preferredStudyTimeRange, semesterStartDate, semesterEndDate } = req.body;
        const email = req.body.email.trim().toLowerCase();

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            name,
            email,
            password: hashedPassword,
            preferredStudyTimeRange,
            semesterStartDate,
            semesterEndDate,
        });

        await user.save();
        
        // Asynchronously send the welcome email (don't await so it doesn't block the request)
        sendWelcomeEmail(user.email, user.name);

        // Create JWT Payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            },
        };

        // Sign Token
        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token, role: user.role });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const password = req.body.password;
        const email = req.body.email.trim().toLowerCase();

        // Check for user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Create JWT Payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            },
        };

        // Sign Token
        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get user profile (includes progress)
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').lean();
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const syllabuses = await Syllabus.find({ userId: req.user.id }).lean();
        
        let subjects = [];
        if (syllabuses) {
             subjects = syllabuses.map(s => {
                 let totalTopics = s.topics.length;
                 let totalScore = 0;
                 s.topics.forEach(t => {
                     const progress = user.topicProgress.find(p => p.topic === t.name);
                     if (progress) {
                         if (progress.highestUnlockedLevel === 'beginner') totalScore += 0;
                         else if (progress.highestUnlockedLevel === 'intermediate') totalScore += 0.33;
                         else if (progress.highestUnlockedLevel === 'advanced') totalScore += 0.66;
                         else if (progress.highestUnlockedLevel === 'completed') totalScore += 1;
                     }
                 });
                 return {
                     subjectName: s.subject,
                     progressPercentage: totalTopics > 0 ? Math.round((totalScore / totalTopics) * 100) : 0
                 };
             });
        }
        
        res.json({ ...user, subjects });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { name, preferredStudyTimeRange, semesterStartDate, semesterEndDate } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        if (name) user.name = name;
        if (preferredStudyTimeRange) {
             user.preferredStudyTimeRange = preferredStudyTimeRange;
        }
        if (semesterStartDate) user.semesterStartDate = semesterStartDate;
        if (semesterEndDate) user.semesterEndDate = semesterEndDate;
        
        await user.save();
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Change user password
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).json({ message: 'User not found' });
        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Request email change OTP
// @route   POST /api/auth/request-email-change
// @access  Private
const requestEmailChange = async (req, res) => {
    try {
        const { currentPassword, newEmail } = req.body;
        const email = newEmail.trim().toLowerCase();
        
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).json({ message: 'User not found' });
        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });
        
        const emailExists = await User.findOne({ email });
        if (emailExists) return res.status(400).json({ message: 'Email is already in use by another account' });
        
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.emailChangeOtp = otp;
        user.emailChangeOtpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        user.newEmailPending = email;
        await user.save();
        
        await sendOtpEmail(email, user.name, otp);
        
        res.json({ message: 'OTP sent to new email' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Verify email change OTP
// @route   POST /api/auth/verify-email-change
// @access  Private
const verifyEmailChange = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).json({ message: 'User not found' });
        
        if (!user.emailChangeOtp || user.emailChangeOtp !== otp || Date.now() > user.emailChangeOtpExpires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        
        // Success
        user.email = user.newEmailPending;
        user.emailChangeOtp = null;
        user.emailChangeOtpExpires = null;
        user.newEmailPending = null;
        await user.save();
        
        res.json({ message: 'Email updated successfully', email: user.email });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Request password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const requestPasswordReset = async (req, res) => {
    try {
        const email = req.body.email.trim().toLowerCase();
        
        const user = await User.findOne({ email });
        if (!user) {
            // We usually don't want to reveal if an email exists or not for security, 
            // but for this app it might be fine. Returning 200 regardless is safer.
            return res.status(404).json({ message: 'User not found with this email' });
        }
        
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.passwordResetOtp = otp;
        user.passwordResetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        await user.save();
        
        const { sendPasswordResetOtpEmail } = require('../services/emailService');
        await sendPasswordResetOtpEmail(user.email, user.name, otp);
        
        res.json({ message: 'Password reset OTP sent to email' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPasswordWithOtp = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const normalizedEmail = email.trim().toLowerCase();
        
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (!user.passwordResetOtp || user.passwordResetOtp !== otp || Date.now() > user.passwordResetOtpExpires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Clear OTP fields
        user.passwordResetOtp = null;
        user.passwordResetOtpExpires = null;
        
        await user.save();
        
        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    signup,
    login,
    getUserProfile,
    updateProfile,
    changePassword,
    requestEmailChange,
    verifyEmailChange,
    requestPasswordReset,
    resetPasswordWithOtp
};
