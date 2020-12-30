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

    res.render('exercise/exercise', {
        todayExercise: todayExercise,
        todayTime: todayTime
    });
});

// router.get('/entry', ensureAuthenticated, (req, res) => {
//     res.render('exercise/exerciseEntry', {
//         exercise: new Exercise()
//     })
// })

router.post('/entry', ensureAuthenticated, async (req, res) => {
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
});

router.put('/edit', ensureAuthenticated, (req, res) => {

})

router.delete('/:id', ensureAuthenticated, async (req, res) => {
    await Exercise.findByIdAndDelete(req.params.id)
    res.redirect('/dashboard/exercise')
})

module.exports = router;
