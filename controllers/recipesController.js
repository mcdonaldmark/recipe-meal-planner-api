const Recipe = require("../models/Recipe");

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("tags");
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate({ path: "userId", select: "firstName lastName email username locale -_id" })
      .populate({ path: "tags", select: "name description -_id" });

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createRecipe = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "You must be logged in" });

    const { title, description, ingredients, steps, tags } = req.body;

    const recipe = new Recipe({
      userId: req.user.id,
      title,
      description,
      ingredients,
      steps,
      tags,
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "You must be logged in" });

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    if (recipe.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed to update this recipe" });

    const { title, description, ingredients, steps, tags } = req.body;

    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (ingredients) recipe.ingredients = ingredients;
    if (steps) recipe.steps = steps;
    if (tags) recipe.tags = tags;

    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "You must be logged in" });

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    if (recipe.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed to delete this recipe" });

    await recipe.remove();
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
