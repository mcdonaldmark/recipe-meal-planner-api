const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const ensureAuthenticated = require('../middleware/auth');

// Get all users (authenticated)
router.get('/', ensureAuthenticated, usersController.getAllUsers);

// Get a single user by ID (authenticated)
router.get('/:id', ensureAuthenticated, usersController.getUserById);

// Create a new user (usually via OAuth)
router.post('/', ensureAuthenticated, usersController.createUser);

// Update a user by ID (authenticated, self only)
router.put('/:id', ensureAuthenticated, usersController.updateUser);

// Delete a user by ID (authenticated, self only)
router.delete('/:id', ensureAuthenticated, usersController.deleteUser);

module.exports = router;
