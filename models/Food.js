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
    carbs: {
        type: Number,
    },
    protein: {
        type: Number,
    },
    fat: {
        type: Number,
    },
    ingredients: {
        type: String,
    },
    date: {
        type: Date,
        default: Date,
        required: true,
    },
    userID: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Food', foodSchema);
