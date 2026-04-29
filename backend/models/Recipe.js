const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
  title: { type: String, required: true, trim: true },
  image: { type: String, default: '' },
  ingredients: { type: String, required: true },
  instructions: { type: String, required: true },
  category: { type: String, default: 'General' },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', recipeSchema);
