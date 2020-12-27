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

router.get('/dashboard', async (req, res) => {
    const todayFood = await Food.find({
        // userID: req.user.id,
        date: {
            $gte: moment().startOf('day').toDate(),
            $lte: moment(moment().startOf('day')).endOf('day').toDate()
        },
    }).sort({ date: 'descending' })

    const todayExercise = await Exercise.find({
        // userID: req.user.id,
        date: {
            $gte: moment().startOf('day').toDate(),
            $lte: moment(moment().startOf('day')).endOf('day').toDate()
        },
    }).sort({ date: 'descending' })

    const todayPosts = await Post.find({
        // userID: req.user.id,
        date: {
            $gte: moment().startOf('day').toDate(),
            $lte: moment(moment().startOf('day')).endOf('day').toDate()
        },
    }).sort({ date: 'descending' })

    let todayCalories = 0
    todayFood.forEach((food) => {
        todayCalories += food.calories
    })

    let todayTime = 0
    todayExercise.forEach((exercise) => {
        todayTime += exercise.time
    })

    res.render('dashboard', {
        foods: todayFood,
        exercise: todayExercise,
        posts: todayPosts,
        todayCalories: todayCalories,
        todayTime: todayTime,
        totalPosts: todayPosts.length,
        // name: req.user.name,
        // date: moment().format('L'),
    })
});

router.post('/dashboard', async (req, res) => {
    let date;
    try {
        date = moment(new Date(Number(req.body.year), Number(req.body.month) - 1, Number(req.body.day)))

        const todayFood = await Food.find({
            // userID: req.user.id,
            date: {
                $gte: moment(date).startOf('day').toDate(),
                $lte: moment(moment(date).startOf('day')).endOf('day').toDate()
            },
        }).sort({ date: 'descending' })

        const todayExercise = await Exercise.find({
            // userID: req.user.id,
            date: {
                $gte: moment(date).startOf('day').toDate(),
                $lte: moment(moment(date).startOf('day')).endOf('day').toDate()
            },
        }).sort({ date: 'descending' })

        const todayPosts = await Post.find({
            // userID: req.user.id,
            date: {
                $gte: moment(date).startOf('day').toDate(),
                $lte: moment(moment(date).startOf('day')).endOf('day').toDate()
            },
        }).sort({ date: 'descending' })

        let todayCalories = 0
        todayFood.forEach((food) => {
            todayCalories += food.calories
        })

        let todayTime = 0
        todayExercise.forEach((exercise) => {
            todayTime += exercise.time
        })

        res.render('dashboard', {
            foods: todayFood,
            exercise: todayExercise,
            posts: todayPosts,
            todayCalories: todayCalories,
            todayTime: todayTime,
            totalPosts: todayPosts.length,
            // name: req.user.name,
            // date: moment().format('L'),
        })
    } catch (err) {
        req.flash('error_msg', 'Please enter numeric values')
        res.redirect('/dashboard')
    }
})

function getUserDate() {

}

module.exports = router;