const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController'); // updated
const ensureAuthenticated = require('../middleware/auth');

// Get all recipes (public)
router.get('/', recipesController.getAllRecipes);

// Get a single recipe by ID (public)
router.get('/:id', recipesController.getRecipeById);

// Create a new recipe (authenticated)
router.post('/', ensureAuthenticated, recipesController.createRecipe);

// Update a recipe by ID (authenticated, owner only)
router.put('/:id', ensureAuthenticated, recipesController.updateRecipe);

// Delete a recipe by ID (authenticated, owner only)
router.delete('/:id', ensureAuthenticated, recipesController.deleteRecipe);

module.exports = router;
