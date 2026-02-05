const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');

// Get all users (admin only)
router.get('/', auth, usersController.getAllUsers);

// Get current logged-in user
router.get('/me', auth, usersController.getCurrentUser);

// Get a user by ID
router.get('/:id', auth, usersController.getUserById);

// Create a user (optional)
router.post('/', auth, usersController.createUser);

// Update a user (self or admin)
router.put('/:id', auth, usersController.updateUser);

// Delete a user (self or admin) — logged-in user stays logged in
router.delete('/:id', auth, usersController.deleteUser);

module.exports = router;
