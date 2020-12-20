const express = require('express');
const Exercise = require('../Models/Exercise');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('you are at the exercise log');
});

router.get('/entry', (req, res) => {
    res.send('enter your activity');
});

module.exports = router;
