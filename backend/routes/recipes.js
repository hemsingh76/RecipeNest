const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const { protect, chefOnly } = require('../middleware/auth');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/recipes';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `recipe_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/recipes - all published recipes
router.get('/', async (req, res) => {
  try {
    const { sort = 'newest', chef } = req.query;
    const filter = { status: 'published' };
    if (chef) filter.chef = chef;

    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    if (sort === 'az') sortObj = { title: 1 };

    const recipes = await Recipe.find(filter).sort(sortObj).populate('chef', 'name photo');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/recipes/my - chef's own recipes
router.get('/my', protect, chefOnly, async (req, res) => {
  try {
    const chef = await Chef.findOne({ user: req.user._id });
    if (!chef) return res.status(404).json({ message: 'Chef profile not found' });
    const recipes = await Recipe.find({ chef: chef._id }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/recipes/:id
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('chef', 'name photo bio');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/recipes - create recipe
router.post('/', protect, chefOnly, upload.single('image'), async (req, res) => {
  try {
    const chef = await Chef.findOne({ user: req.user._id });
    if (!chef) return res.status(404).json({ message: 'Chef profile not found' });

    const { title, ingredients, instructions, category, status } = req.body;
    const recipe = await Recipe.create({
      chef: chef._id,
      title,
      ingredients,
      instructions,
      category: category || 'General',
      status: status || 'published',
      image: req.file ? `/uploads/recipes/${req.file.filename}` : ''
    });
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/recipes/:id
router.put('/:id', protect, chefOnly, upload.single('image'), async (req, res) => {
  try {
    const chef = await Chef.findOne({ user: req.user._id });
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.chef.toString() !== chef._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const { title, ingredients, instructions, category, status } = req.body;
    recipe.title = title || recipe.title;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    recipe.category = category || recipe.category;
    recipe.status = status || recipe.status;
    if (req.file) recipe.image = `/uploads/recipes/${req.file.filename}`;

    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/recipes/:id
router.delete('/:id', protect, chefOnly, async (req, res) => {
  try {
    const chef = await Chef.findOne({ user: req.user._id });
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.chef.toString() !== chef._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
