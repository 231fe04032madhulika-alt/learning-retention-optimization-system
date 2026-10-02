require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const TARGET_EMAIL = 'madhulikavoleti@gmail.com';

async function makeAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        const user = await User.findOne({ email: TARGET_EMAIL });

        if (!user) {
            console.log(`❌ User with email "${TARGET_EMAIL}" not found in the database.`);
            console.log("Please make sure you have created an account with this exact email first.");
            process.exit(0);
        }

        user.role = 'admin';
        await user.save();

        console.log(`✅ Success! The account for "${TARGET_EMAIL}" has been upgraded to an ADMIN.`);
        console.log("If you are currently logged in with this account, please Log Out and Log Back In to see the Admin Dashboard.");
        process.exit(0);

    } catch (error) {
        console.error("Error updating user:", error);
        process.exit(1);
    }
}

makeAdmin();
