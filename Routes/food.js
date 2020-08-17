const express = require('express');
const Food = require('../Models/Food');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('you are at the food page');
});

router.get('/entry', (req, res) => {
    res.send('enter your meal');
});

module.exports = router;
