const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const getUsers = async (req, res) => {
    try {
        const db = getDB();
        const users = await db.collection('users').find({}).toArray();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, age } = req.body;
        if (!name || isNaN(age)) {
            return res.status(400).json({ error: 'Name and valid age are required' });
        }

        const db = getDB();
        const newUser = { name, age: parseInt(age, 10) };
        const result = await db.collection('users').insertOne(newUser);
        
        res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const db = getDB();
        
        const updateDoc = { $set: {} };
        if (name) updateDoc.$set.name = name;
        if (age !== undefined) updateDoc.$set.age = parseInt(age, 10);

        if (Object.keys(updateDoc.$set).length === 0) {
            return res.status(400).json({ error: 'No valid fields provided for update' });
        }

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(id) },
            updateDoc
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const db = getDB();
        const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};
