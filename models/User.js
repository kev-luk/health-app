const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        minlength: 8,
        required: true,
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
    },
    date: {
        type: Date,
        default: Date
    }
});

module.exports = mongoose.model('User', userSchema);