const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    calories: {
        type: Number,
        required: true,
    },
    ingredients: {
        type: String,
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

module.exports = mongoose.model('Food', foodSchema);
