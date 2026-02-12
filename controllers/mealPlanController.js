// controllers/mealPlanController.js
const MealPlan = require("../models/MealPlan");

// GET meal plan by ID
const getMealPlanById = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id)
      .populate({ path: "recipeId", select: "title description -_id" });

    if (!mealPlan) return res.status(404).json({ message: "MealPlan not found" });

    // Ensure the current user owns the meal plan
    const mealPlanUserId = mealPlan.userId._id ? mealPlan.userId._id.toString() : mealPlan.userId.toString();
    if (mealPlanUserId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json(mealPlan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET all meal plans for current user
const getMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ userId: req.user.id })
      .populate({ path: "recipeId", select: "title description -_id" });

    res.json(mealPlans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// CREATE a new meal plan
const createMealPlan = async (req, res) => {
  try {
    const newMealPlan = new MealPlan({
      ...req.body,
      userId: req.user.id, // always set from logged-in user
    });

    const savedMealPlan = await newMealPlan.save();
    res.status(201).json(savedMealPlan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE a meal plan by ID
const updateMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) return res.status(404).json({ message: "MealPlan not found" });

    const mealPlanUserId = mealPlan.userId._id ? mealPlan.userId._id.toString() : mealPlan.userId.toString();
    if (mealPlanUserId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    Object.assign(mealPlan, req.body);
    const updatedMealPlan = await mealPlan.save();
    res.json(updatedMealPlan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE a meal plan by ID
const deleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) return res.status(404).json({ message: "MealPlan not found" });

    const mealPlanUserId = mealPlan.userId._id ? mealPlan.userId._id.toString() : mealPlan.userId.toString();
    if (mealPlanUserId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await mealPlan.deleteOne();
    res.json({ message: "MealPlan deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getMealPlanById,
  getMealPlans,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
};
