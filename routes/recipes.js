const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');
const auth = require('../middleware/auth');

router.get('/', auth, recipesController.getAllRecipes);
router.get('/:id', auth, recipesController.getRecipeById);
router.post('/', auth, recipesController.createRecipe);
router.put('/:id', auth, recipesController.updateRecipe);
router.delete('/:id', auth, recipesController.deleteRecipe);

module.exports = router;
