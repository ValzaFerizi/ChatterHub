const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true },
  bio: { type: String, default: null },
  avatar_url: { type: String, default: null },
  preferences: { type: mongoose.Schema.Types.Mixed, default: {} }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
