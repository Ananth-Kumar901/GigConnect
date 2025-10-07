const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['client','freelancer'], required: true },

    // Freelancer-specific fields
    skills: { type: [String], default: [] },
    portfolio: { type: [String], default: [] },
    serviceRate: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
