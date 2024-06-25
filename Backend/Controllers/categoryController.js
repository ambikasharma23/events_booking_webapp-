const db = require("../models");
const Category = db.event_category;

const getCategory = async (req, res) => {
  try {
    const { limit, offset } = req.query;

    if (req.params.id) {
      const categoryId = req.params.id;
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json(category);
    } else {
      const queryOptions = {};

      // Apply limit and offset if provided
      if (limit && !isNaN(parseInt(limit, 10))) {
        queryOptions.limit = parseInt(limit, 10);
      }
      if (offset && !isNaN(parseInt(offset, 10))) {
        queryOptions.offset = parseInt(offset, 10);
      }

      const results = await Category.findAll(queryOptions);
      res.status(200).json(results);
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json({ newCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error during insertion" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ error: "category not found" });
    }
    await Category.destroy({
      where: {
        id: categoryId,
      },
    });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getCategory, createCategory, deleteCategory };
