const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, default: '' },
  budget: { type: Number, default: 0 },
  skills: { type: [String], default: [] },
  status: { type: String, enum: ['open','in-progress','closed'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('Gig', gigSchema);
