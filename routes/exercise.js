const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, (req, res) => {
    res.send('no access')
});

router.post('/new', async (req, res) => {
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

router.patch('/edit', (req, res) => {

})

router.delete('/', (req, res) => {

})

module.exports = router;
