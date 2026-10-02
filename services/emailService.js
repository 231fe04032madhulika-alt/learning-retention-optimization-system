const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    // Using a test service configuration for demonstration. 
    // In production, configure with actual SMTP settings (e.g., Gmail, SendGrid)
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendStudyReminder = async (userEmail, subject, unit, topic, time, scheduleId) => {
    try {
        const actionUrl = `http://localhost:3000/?action=mark_done&id=${scheduleId}&topic=${encodeURIComponent(topic)}`;
        
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"Study Assistant" <noreply@studyassistant.com>',
            to: userEmail,
            subject: `Study Reminder: ${unit} -> ${topic}`,
            text: `Reminder: It is time to study today's topic: ${unit} -> ${topic}. Please mark it done using this link: ${actionUrl}`,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h2 style="color: #6366f1; margin-top: 0;">Study Reminder</h2>
                    <p style="font-size: 16px;">Hello,</p>
                    <p style="font-size: 16px;">Reminder: It is time to study today's topic.</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #6366f1; margin: 20px 0;">
                        <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
                        <p style="margin: 0 0 10px 0;"><strong>Today's Topic:</strong> ${unit} &rarr; ${topic}</p>
                        <p style="margin: 0;"><strong>Time:</strong> ${new Date(time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    <p style="font-size: 16px;">When you have completed your study session for this topic, click the button below to mark it as done and launch your mock test!</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${actionUrl}" style="background-color: #22c55e; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">✅ Mark as Done & Start Test</a>
                    </div>
                </div>
            </div>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${userEmail}. Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"Study Assistant" <noreply@studyassistant.com>',
            to: userEmail,
            subject: 'Welcome to LearnOptima!',
            text: `Hi ${userName},\n\nWelcome to my project.....!\n\nWe're excited to have you on board to optimize your study sessions.`,
            html: `<h3>Welcome to LearnOptima!</h3>
                   <p>Hi <strong>${userName}</strong>,</p>
                   <p>Welcome to my project.....!</p>
                   <p>We're excited to have you on board to optimize your study sessions.</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent successfully to ${userEmail}. Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        // Don't throw, we don't want to break the signup flow if email fails
    }
};

const sendOtpEmail = async (userEmail, userName, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"Study Assistant" <noreply@studyassistant.com>',
            to: userEmail,
            subject: 'Your Verification Code',
            text: `Hi ${userName},\n\nYour verification code to change your email is: ${otp}\nThis code will expire in 10 minutes.`,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Email Verification</h2>
                <p>Hi <strong>${userName}</strong>,</p>
                <p>You requested to change your email address. Here is your verification code:</p>
                <h1 style="color: #6366f1; letter-spacing: 5px;">${otp}</h1>
                <p>This code will expire in 10 minutes.</p>
                <p>If you did not request this, please secure your account immediately.</p>
            </div>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${userEmail}. Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error;
    }
};

const sendPasswordResetOtpEmail = async (userEmail, userName, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"Study Assistant" <noreply@studyassistant.com>',
            to: userEmail,
            subject: 'Password Reset Verification Code',
            text: `Hi ${userName},\n\nYour verification code to reset your password is: ${otp}\nThis code will expire in 10 minutes.`,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Password Reset</h2>
                <p>Hi <strong>${userName}</strong>,</p>
                <p>You requested to reset your password. Here is your verification code:</p>
                <h1 style="color: #6366f1; letter-spacing: 5px;">${otp}</h1>
                <p>This code will expire in 10 minutes.</p>
                <p>If you did not request a password reset, please secure your account immediately.</p>
            </div>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Password reset OTP email sent to ${userEmail}. Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Error sending password reset OTP email:', error);
        throw error;
    }
};

module.exports = { sendStudyReminder, sendWelcomeEmail, sendOtpEmail, sendPasswordResetOtpEmail };
