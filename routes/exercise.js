const express = require('express');
const router = express.Router();
const moment = require('moment')
const Exercise = require('../models/Exercise');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', async (req, res) => {
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

    let todayCalories = 0
    todayExercise.forEach((exercise) => {
        todayCalories += exercise.caloriesBurned
    })

    res.render('exercise/exercise', {
        date: moment().format('L'),
        todayExercise: todayExercise,
        todayTime: todayTime,
        todayCalories: todayCalories
    });
});

router.post('/', async (req, res) => {
    let date;
    try {
        date = moment(new Date(Number(req.body.year), Number(req.body.month) - 1, Number(req.body.day)))

        const todayExercise = await Exercise.find({
            date: {
                $gte: moment(date).startOf('day').toDate(),
                $lte: moment(moment(date).startOf('day')).endOf('day').toDate()
            }
        }).sort({ date: 'descending' })

        let todayTime = 0
        todayExercise.forEach((exercise) => {
            todayTime += exercise.time
        })

        let todayCalories = 0
        todayExercise.forEach((exercise) => {
            todayCalories += exercise.caloriesBurned
        })

        res.render('exercise/exercise', {
            date: date.format('MM/DD/YYYY'),
            todayExercise: todayExercise,
            todayTime: todayTime,
            todayCalories: todayCalories
        });
    } catch (err) {
        req.flash('error_msg', 'Please enter numeric values')
        res.redirect('/dashboard/exercise')
    }
});

router.post('/entry', ensureAuthenticated, async (req, res) => {
    if (!req.body.activity) {
        req.flash('error_msg', 'Please enter an activity name')
        res.redirect('/dashboard/exercise')
    } else if (!req.body.time) {
        req.flash('error_msg', 'Please enter time duration of your activity')
        res.redirect('/dashboard/exercise')
    } else {
        let exercise = new Exercise({
            activity: req.body.activity,
            time: req.body.time,
            caloriesBurned: req.body.caloriesBurned,
            description: req.body.description,
            userID: req.user.id,
        })

        try {
            exercise = await exercise.save()
            req.flash('success_msg', 'Successfully saved exercise!')
            res.redirect('/dashboard/exercise')
        } catch (err) {
            req.flash('error_msg', 'Unable to save exercise');
            res.send('not registered')
            console.log(err)
        }
    }
});

router.get('/:id', async (req, res) => {
    const exercise = await Exercise.findById(req.params.id)
    res.render('exercise/exerciseView', {
        exercise: exercise
    })
})

router.get('/edit/:id', async (req, res) => {
    const exercise = await Exercise.findById(req.params.id)
    res.render('exercise/exerciseEdit', {
        exercise: exercise
    })
})

router.put('/:id', async (req, res) => {
    let exercise = await Exercise.findById(req.params.id)
    const { activity, time, caloriesBurned, description } = req.body
    exercise.activity = activity
    exercise.time = time
    exercise.caloriesBurned = caloriesBurned
    exercise.description = description

    try {
        exercise = await exercise.save()
        req.flash('success_msg', 'Sucessfully updated')
        res.redirect(`/dashboard/exercise/${exercise.id}`)
    } catch (err) {
        req.flash('error_msg', 'Unable to save changes')
        res.redirect(`/dashboard/exercise/edit/${exercise.id}`, {
            exercise: exercise
        })
    }
})

router.delete('/:id', async (req, res) => {
    await Exercise.findByIdAndDelete(req.params.id)
    res.redirect('/dashboard/exercise')
})

module.exports = router;
