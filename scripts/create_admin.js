const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/assistant";

async function createAdmin() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB for Admin creation.");

        const email = "admin@studyassistant.com";
        const existing = await User.findOne({ email });

        if (existing) {
            console.log("Admin account already exists! Login with admin@studyassistant.com / admin123");
            mongoose.connection.close();
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        const admin = new User({
            name: "Super Admin",
            email: email,
            password: hashedPassword,
            role: "admin",
            semesterStartDate: new Date(),
            semesterEndDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
            preferredStudyTimeRange: { start: "09:00", end: "17:00" }
        });

        await admin.save();
        console.log("SUCCESS: Admin User Created");
        console.log("Email: admin@studyassistant.com \nPassword: admin123");

        mongoose.connection.close();
    } catch (err) {
        console.error("Error creating admin:", err);
        mongoose.connection.close();
    }
}

createAdmin();
