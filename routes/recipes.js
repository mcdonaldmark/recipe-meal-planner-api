const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');
const ensureAuthenticated = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validation');

router.get('/', ensureAuthenticated, recipesController.getAllRecipes);

router.get('/:id', ensureAuthenticated, recipesController.getRecipeById);

router.post(
  '/',
  ensureAuthenticated,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('ingredients')
      .isArray({ min: 1 })
      .withMessage('Ingredients must be an array with at least one item'),
    body('ingredients.*').isString().withMessage('Each ingredient must be a string'),
    body('steps')
      .isArray({ min: 1 })
      .withMessage('Steps must be an array with at least one item'),
    body('steps.*').isString().withMessage('Each step must be a string'),
    body('tags').optional().isArray(),
    body('tags.*').optional().isString()
  ],
  validate,
  recipesController.createRecipe
);

router.put(
  '/:id',
  ensureAuthenticated,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().isString(),
    body('ingredients').optional().isArray({ min: 1 }).withMessage('Ingredients must be an array with at least one item'),
    body('ingredients.*').optional().isString().withMessage('Each ingredient must be a string'),
    body('steps').optional().isArray({ min: 1 }).withMessage('Steps must be an array with at least one item'),
    body('steps.*').optional().isString().withMessage('Each step must be a string'),
    body('tags').optional().isArray(),
    body('tags.*').optional().isString()
  ],
  validate,
  recipesController.updateRecipe
);

router.delete('/:id', ensureAuthenticated, recipesController.deleteRecipe);

module.exports = router;
