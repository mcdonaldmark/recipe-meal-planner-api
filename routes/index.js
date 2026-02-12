const express = require("express");
const router = express.Router();

router.use("/recipes", require("./recipes"));
router.use("/users", require("./users"));
router.use("/tags", require("./tags"));
router.use("/mealplans", require("./mealPlan"));

module.exports = router;
