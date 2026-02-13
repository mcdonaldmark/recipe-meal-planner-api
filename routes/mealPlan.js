const express = require("express");
const router = express.Router();
const mealPlanController = require("../controllers/mealPlanController");
const ensureAuthenticated = require("../middleware/auth");
const { body } = require("express-validator");
const validate = require("../middleware/validation");

router.get("/", ensureAuthenticated, mealPlanController.getMealPlans);

router.get("/:id", ensureAuthenticated, mealPlanController.getMealPlanById);

router.post(
  "/",
  ensureAuthenticated,
  [
    body("recipeIds").isArray({ min: 1 }).withMessage("recipeIds must be an array with at least one item"),
    body("mealType").notEmpty().withMessage("mealType is required"),
    body("mealType").isIn(["breakfast", "lunch", "dinner", "snack"]).withMessage("mealType must be valid"),
    body("date").optional().isISO8601().toDate(),
    body("notes").optional().isString(),
    body("recipeIds.*").isMongoId().withMessage("Each recipeId must be a valid Mongo ID"),
  ],
  validate,
  mealPlanController.createMealPlan
);

router.put(
  "/:id",
  ensureAuthenticated,
  [
    body("recipeIds").optional().isArray({ min: 1 }),
    body("recipeIds.*").optional().isMongoId(),
    body("mealType").optional().isIn(["breakfast", "lunch", "dinner", "snack"]),
    body("date").optional().isISO8601().toDate(),
    body("notes").optional().isString(),
  ],
  validate,
  mealPlanController.updateMealPlan
);

router.delete("/:id", ensureAuthenticated, mealPlanController.deleteMealPlan);

module.exports = router;
