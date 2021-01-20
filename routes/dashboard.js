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

    const posts = await Post.find()

    let todayCalories = 0
    todayFood.forEach((food) => {
        todayCalories += food.calories
    })

    let todayCaloriesBurned = 0
    todayExercise.forEach((exercise) => {
        todayCaloriesBurned += exercise.caloriesBurned
    })

    res.render('dashboard', {
        // name: req.user.name,
        todayCalories: todayCalories,
        todayCaloriesBurned: todayCaloriesBurned,
        totalPosts: posts.length,
        date: moment().format('L'),
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

        const posts = await Post.find()

        let todayCalories = 0
        todayFood.forEach((food) => {
            todayCalories += food.calories
        })

        let todayCaloriesBurned = 0
        todayExercise.forEach((exercise) => {
            todayCaloriesBurned += exercise.caloriesBurned
        })

        res.render('dashboard', {
            // name: req.user.name,
            todayCalories: todayCalories,
            todayCaloriesBurned: todayCaloriesBurned,
            totalPosts: posts.length,
            date: date.format('MM/DD/YYYY'),
        })
    } catch (err) {
        req.flash('error_msg', 'Please enter numeric values')
        res.redirect('/dashboard')
    }
})

function getUserDate() {

}

module.exports = router;