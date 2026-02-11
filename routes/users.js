const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const ensureAuthenticated = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validation');

// GET all users
router.get('/', ensureAuthenticated, usersController.getAllUsers);

// GET a user by ID
router.get('/:id', ensureAuthenticated, usersController.getUserById);

// POST create a new user
router.post(
  '/',
  ensureAuthenticated,
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Must be a valid email'),
    body('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('locale').optional().isString()
  ],
  validate,
  usersController.createUser
);

// PUT update a user
router.put(
  '/:id',
  ensureAuthenticated,
  [
    body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('email').optional().isEmail().withMessage('Must be a valid email'),
    body('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('locale').optional().isString()
  ],
  validate,
  usersController.updateUser
);

// DELETE a user
router.delete('/:id', ensureAuthenticated, usersController.deleteUser);

module.exports = router;
