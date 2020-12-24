const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, async (req, res) => {
    const todayExercise = await Exercise.find({
        date: {
            $gte: moment().startOf('day').toDate(),
            $lte: moment(moment().startOf('day')).endOf('day').toDate()
        }
    }).sort({ date: 'descending' })

    let todayTime = 0
    todayExercise.forEach((exercise) => {
        todayTime += exercise.time
    })

    res.render('food/food', {
        todayExercise: todayExercise,
        todayTime: todayTime
    });
});

router.post('/new', ensureAuthenticated, async (req, res) => {
    let exercise = new Exercise({
        activity: req.body.activity,
        time: req.body.time,
        caloriesBurned: req.body.caloriesBurned,
        description: req.body.description
    })

    try {
        exercise = await exercise.save()
        res.send(exercise)
    } catch (err) {
        res.send('not registered')
        console.log(err)
    }
});

router.patch('/edit', ensureAuthenticated, (req, res) => {

})

router.delete('/', ensureAuthenticated, (req, res) => {

})

module.exports = router;
