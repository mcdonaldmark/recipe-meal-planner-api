const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');

// Users CRUD
router.get('/', auth, usersController.getAllUsers); // get all users
router.get('/currentUser', auth, usersController.getCurrentUser); // get logged-in user
router.get('/:id', auth, usersController.getUserById); // get specific user
router.post('/', auth, usersController.createUser); // create user manually
router.put('/:id', auth, usersController.updateUser); // update self
router.delete('/:id', auth, usersController.deleteUser); // delete self

module.exports = router;
