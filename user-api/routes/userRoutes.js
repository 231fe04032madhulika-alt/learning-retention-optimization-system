const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');

// GET /users
router.get('/', getUsers);

// POST /users
router.post('/', createUser);

// PUT /users/:id
router.put('/:id', updateUser);

// DELETE /users/:id
router.delete('/:id', deleteUser);

module.exports = router;
