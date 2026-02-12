const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");
const ensureAuthenticated = require("../middleware/auth");

// All routes require Google login
router.get("/", ensureAuthenticated, tagController.getAllTags);
router.get("/:id", ensureAuthenticated, tagController.getTagById);
router.post("/", ensureAuthenticated, tagController.createTag);
router.put("/:id", ensureAuthenticated, tagController.updateTag);
router.delete("/:id", ensureAuthenticated, tagController.deleteTag);

module.exports = router;
