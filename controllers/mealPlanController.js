const MealPlan = require("../models/mealplan");
const Recipe = require("../models/recipes"); // ensure path is correct
const User = require("../models/users");

// ------------------- GET ALL MEAL PLANS -------------------
const getAllMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find()
      .populate("recipeId", "title ingredients cookingTime difficulty") // populate recipe
      .populate("userId", "firstName lastName email"); // optional: populate user
    res.status(200).json(mealPlans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- GET MEAL PLAN BY ID -------------------
const getMealPlanById = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id)
      .populate("recipeId", "title ingredients cookingTime difficulty")
      .populate("userId", "firstName lastName email");

    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan not found" });
    }

    res.status(200).json(mealPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- CREATE MEAL PLAN -------------------
const createMealPlan = async (req, res) => {
  try {
    const { userId, recipeId, date, mealType, notes } = req.body;

    // Validate required fields
    if (!userId || !recipeId || !mealType) {
      return res.status(400).json({ message: "userId, recipeId, and mealType are required" });
    }

    // Optional: Check if user and recipe exist
    const user = await User.findById(userId);
    const recipe = await Recipe.findById(recipeId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const mealPlan = new MealPlan({
      userId,
      recipeId,
      date: date || Date.now(),
      mealType,
      notes,
    });

    const savedMealPlan = await mealPlan.save();

    // Populate before returning
    await savedMealPlan.populate("recipeId", "title ingredients cookingTime difficulty")
      .populate("userId", "firstName lastName email");

    res.status(201).json(savedMealPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- UPDATE MEAL PLAN -------------------
const updateMealPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { recipeId, date, mealType, notes } = req.body;

    const mealPlan = await MealPlan.findById(id);
    if (!mealPlan) return res.status(404).json({ message: "Meal plan not found" });

    // Update fields if provided
    if (recipeId) {
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) return res.status(404).json({ message: "Recipe not found" });
      mealPlan.recipeId = recipeId;
    }
    if (date) mealPlan.date = date;
    if (mealType) mealPlan.mealType = mealType;
    if (notes !== undefined) mealPlan.notes = notes;

    const updatedMealPlan = await mealPlan.save();

    await updatedMealPlan.populate("recipeId", "title ingredients cookingTime difficulty")
      .populate("userId", "firstName lastName email");

    res.status(200).json(updatedMealPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- DELETE MEAL PLAN -------------------
const deleteMealPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const mealPlan = await MealPlan.findById(id);
    if (!mealPlan) return res.status(404).json({ message: "Meal plan not found" });

    await mealPlan.remove();
    res.status(200).json({ message: "Meal plan deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
};
