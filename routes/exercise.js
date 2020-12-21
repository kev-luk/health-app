const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');
const verify = require('./verifyToken')

router.get('/', verify, (req, res) => {
    res.json({
        posts: {
            title: "hello everyone",
            description: "post post post post"
        }
    })
});

router.post('/entry', async (req, res) => {
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

module.exports = router;
