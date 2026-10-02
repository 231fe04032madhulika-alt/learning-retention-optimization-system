require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

async function resetDB() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB for complete reset");

        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.drop();
            console.log(`Dropped collection: ${collection.collectionName}`);
        }

        console.log("Database completely reset.");
        mongoose.connection.close();
    } catch (err) {
        console.error("Error resetting DB:", err);
        mongoose.connection.close();
    }
}

resetDB();
