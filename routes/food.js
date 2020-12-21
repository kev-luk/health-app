const express = require('express');
const Food = require('../models/Food');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('you are at the food page');
});

router.post('/entry', async (req, res) => {
    let food = new Food({
        name: req.body.name,
        calories: req.body.calories,
        ingredients: req.body.ingredients,
        description: req.body.description
    })

    try {
        food = await food.save()
        res.send(food)
    } catch (err) {
        res.send('not registered')
        console.log(err)
    }
});

module.exports = router;
