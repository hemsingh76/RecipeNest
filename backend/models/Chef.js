const mongoose = require('mongoose');

//database schema for chef
const chefSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  bio: { type: String, default: '' },
  photo: { type: String, default: '' },
  contact: { type: String, default: '' },
  social: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Chef', chefSchema);
