const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, (req, res) => {
    res.send('you are at the food page');
});

router.post('/new', ensureAuthenticated, async (req, res) => {

});

router.patch('/edit', ensureAuthenticated, (req, res) => {

})

router.delete('/', ensureAuthenticated, (req, res) => {

})

module.exports = router;