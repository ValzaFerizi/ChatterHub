const mongoose = require('mongoose');

const exportSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  type: { type: String, enum: ['csv', 'excel', 'json'], required: true },
  entity: { type: String, required: true },
  filename: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

exportSchema.index({ user_id: 1 });

module.exports = mongoose.model('Export', exportSchema);
