const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  expires_at: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

sessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
sessionSchema.index({ user_id: 1 });

module.exports = mongoose.model('Session', sessionSchema);
