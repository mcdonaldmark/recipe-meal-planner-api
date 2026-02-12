const Tag = require("../models/Tag");

const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTagById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    const tag = new Tag({ name, description });
    await tag.save();

    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updatedTag = await Tag.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true },
    );

    if (!updatedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.json(updatedTag);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });

    res.json({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
};
