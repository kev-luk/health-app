const mongoose = require('mongoose');
const moment = require('moment')

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
