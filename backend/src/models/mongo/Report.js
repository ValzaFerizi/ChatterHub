const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

reportSchema.index({ user_id: 1 });

module.exports = mongoose.model('Report', reportSchema);
