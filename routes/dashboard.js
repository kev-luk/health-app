const express = require('express');
const router = express.Router();
const moment = require('moment')
const Food = require('../models/Food')
const Exercise = require('../models/Exercise')
const Post = require('../models/Post')
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => {
    res.render('welcome');
});

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    console.log(req.user)

    const foodAll = await Food.find({
        userID: req.user.id,
        date: {
            $gte: moment().startOf('day').toDate(),
            $lte: moment(moment().startOf('day')).endOf('day').toDate()
        },
    }).sort({ date: 'descending' })

    const exerciseAll = await Exercise.find({
        userID: req.user.id,
        date: {
            $gte: moment().startOf('day').toDate(),
            $lte: moment(moment().startOf('day')).endOf('day').toDate()
        },
    }).sort({ date: 'descending' })

    const postAll = await Post.find({
        userID: req.user.id,
        date: {
            $gte: moment().startOf('day').toDate(),
            $lte: moment(moment().startOf('day')).endOf('day').toDate()
        },
    }).sort({ date: 'descending' })

    console.log(foodAll)
    console.log(exerciseAll)
    console.log(postAll)

    res.render('dashboard', {
        foods: foodAll,
        exercise: exerciseAll,
        posts: postAll,
    })
});

module.exports = router;