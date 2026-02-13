const express = require("express");
const router = express.Router();
const mealPlanController = require("../controllers/mealPlanController");
const ensureAuthenticated = require("../middleware/auth");
const { body } = require("express-validator");
const validate = require("../middleware/validation");

// Get all meal plans
router.get("/", ensureAuthenticated, mealPlanController.getMealPlans);

// Get a meal plan by ID
router.get("/:id", ensureAuthenticated, mealPlanController.getMealPlanById);

// Create a meal plan
router.post(
  "/",
  ensureAuthenticated,
  [
    body("recipeId").notEmpty().withMessage("recipeId is required").isMongoId(),
    body("mealType").notEmpty().withMessage("mealType is required")
      .isIn(["breakfast", "lunch", "dinner", "snack"]).withMessage("Invalid mealType"),
    body("date").optional().isISO8601().toDate(),
    body("notes").optional().isString()
  ],
  validate,
  mealPlanController.createMealPlan
);

// Update a meal plan
router.put(
  "/:id",
  ensureAuthenticated,
  [
    body("recipeId").optional().isMongoId(),
    body("mealType").optional().isIn(["breakfast", "lunch", "dinner", "snack"]),
    body("date").optional().isISO8601().toDate(),
    body("notes").optional().isString()
  ],
  validate,
  mealPlanController.updateMealPlan
);

// Delete a meal plan
router.delete("/:id", ensureAuthenticated, mealPlanController.deleteMealPlan);

module.exports = router;
