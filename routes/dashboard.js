const express = require('express');
const router = express.Router();
const verify = require('./verifyToken')

router.get('/', (req, res) => {
    res.render('welcome');
});

router.get('/dashboard', verify, (req, res) => {
    res.send('you have access')
});

module.exports = router;