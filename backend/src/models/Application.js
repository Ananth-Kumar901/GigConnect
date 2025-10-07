const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, default: '' },
  bidAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
