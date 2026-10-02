const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        semesterStartDate: {
            type: Date,
            required: true,
        },
        semesterEndDate: {
            type: Date,
            required: true,
        },
        preferredStudyTimeRange: {
            start: { type: String, required: true },
            end: { type: String, required: true }
        },
        topicProgress: [
            {
                topic: { type: String, required: true },
                highestUnlockedLevel: {
                    type: String,
                    enum: ['beginner', 'intermediate', 'advanced', 'completed'],
                    required: true,
                    default: 'beginner'
                }
            }
        ],
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        emailChangeOtp: { type: String, default: null },
        emailChangeOtpExpires: { type: Date, default: null },
        newEmailPending: { type: String, default: null },
        passwordResetOtp: { type: String, default: null },
        passwordResetOtpExpires: { type: Date, default: null }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
