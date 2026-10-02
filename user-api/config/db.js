const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'mydb';

let db;

const connectDB = async () => {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB server');
        db = client.db(dbName);
        
        // Ensure "users" collection exists and insert a default user if empty
        const usersCollection = db.collection('users');
        const count = await usersCollection.countDocuments();
        
        if (count === 0) {
            await usersCollection.insertOne({ name: 'Ravi', age: 22 });
            console.log('Inserted default user: { name: "Ravi", age: 22 }');
        }
    } catch (error) {
        console.error('Failed to connect to MongoDB:\n', error);
        process.exit(1);
    }
};

const getDB = () => {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};

module.exports = { connectDB, getDB };
