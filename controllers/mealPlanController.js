const MealPlan = require("../models/MealPlan");
const Recipe = require("../models/Recipe");

exports.getMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ user: req.user.id }).populate("recipeIds");
    res.json(mealPlans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMealPlanById = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id).populate("recipeIds");
    if (!mealPlan) return res.status(404).json({ message: "Meal plan not found" });
    res.json(mealPlan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createMealPlan = async (req, res) => {
  try {
    const { recipeIds, mealType, date, notes } = req.body;

    // Optional: verify all recipeIds exist
    const recipesExist = await Recipe.find({ _id: { $in: recipeIds } });
    if (recipesExist.length !== recipeIds.length) {
      return res.status(400).json({ message: "One or more recipeIds are invalid" });
    }

    const newMealPlan = new MealPlan({
      user: req.user.id,
      recipeIds,
      mealType,
      date,
      notes,
    });

    await newMealPlan.save();
    res.status(201).json(newMealPlan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) return res.status(404).json({ message: "Meal plan not found" });

    const { recipeIds, mealType, date, notes } = req.body;

    if (recipeIds) mealPlan.recipeIds = recipeIds;
    if (mealType) mealPlan.mealType = mealType;
    if (date) mealPlan.date = date;
    if (notes) mealPlan.notes = notes;

    await mealPlan.save();
    res.json(mealPlan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) return res.status(404).json({ message: "Meal plan not found" });

    await mealPlan.remove();
    res.json({ message: "Meal plan deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
