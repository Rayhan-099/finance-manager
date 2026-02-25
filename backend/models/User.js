const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    monthlyBudget: {
        type: Number,
        default: 0,
    },
    customCategories: {
        type: [String],
        default: [],
    },
    categoryBudgets: [{
        category: String,
        limit: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
