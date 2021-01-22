const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    activity: {
        type: String,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
    caloriesBurned: {
        type: Number,
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    userID: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Exercise', exerciseSchema);
