const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const ensureAuthenticated = require('../middleware/auth');

// Get all users (authenticated)
router.get('/', ensureAuthenticated, usersController.getAllUsers);

// Get a single user by ID (authenticated)
router.get('/:id', ensureAuthenticated, usersController.getUserById);

// Create a new user (optional, usually handled by Google OAuth)
router.post('/', usersController.createUser);

// Update logged-in user (self only)
router.put('/:id', ensureAuthenticated, usersController.updateUser);

// Delete logged-in user (self only, but keeps session alive)
router.delete('/:id', ensureAuthenticated, usersController.deleteUser);

module.exports = router;
