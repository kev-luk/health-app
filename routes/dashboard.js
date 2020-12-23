const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Food = require('../models/Food')
const Exercise = require('../models/Exercise')
const Post = require('../models/Post')

router.get('/', (req, res) => {
    res.render('welcome');
});

router.get('/dashboard', async (req, res) => {
    const foodAll = await Food.find().sort({ date: 'descending' })
    const exerciseAll = await Exercise.find().sort({ date: 'descending' })
    const postAll = await Post.find().sort({ date: 'descending' })

    res.render('dashboard', {
        foods: foodAll,
        exercise: exerciseAll,
        posts: postAll,
    })
});

module.exports = router;