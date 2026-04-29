const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Chef = require('../models/Chef');
const { protect, chefOnly } = require('../middleware/auth');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/chefs';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `chef_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/chefs - all chefs
router.get('/', async (req, res) => {
  try {
    const chefs = await Chef.find().populate('user', 'name email');
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/chefs/:id - single chef
router.get('/:id', async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id).populate('user', 'name email');
    if (!chef) return res.status(404).json({ message: 'Chef not found' });
    res.json(chef);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/chefs/me/profile - logged-in chef's profile
router.get('/me/profile', protect, chefOnly, async (req, res) => {
  try {
    const chef = await Chef.findOne({ user: req.user._id });
    if (!chef) return res.status(404).json({ message: 'Chef profile not found' });
    res.json(chef);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/chefs/me/profile - update own profile
router.put('/me/profile', protect, chefOnly, upload.single('photo'), async (req, res) => {
  try {
    const { name, bio, contact, facebook, instagram, twitter } = req.body;
    const chef = await Chef.findOne({ user: req.user._id });
    if (!chef) return res.status(404).json({ message: 'Chef profile not found' });

    chef.name = name || chef.name;
    chef.bio = bio !== undefined ? bio : chef.bio;
    chef.contact = contact !== undefined ? contact : chef.contact;
    chef.social = {
      facebook: facebook || chef.social.facebook,
      instagram: instagram || chef.social.instagram,
      twitter: twitter || chef.social.twitter
    };
    if (req.file) chef.photo = `/uploads/chefs/${req.file.filename}`;

    await chef.save();
    res.json(chef);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
