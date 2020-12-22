const express = require('express');
const { verify } = require('jsonwebtoken');
const Food = require('../models/Food');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('you are at the food page');
});

router.post('/new', async (req, res) => {
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

router.patch('/edit', verify, (req, res) => {

})

router.delete('/', verify, (req, res) => {

})

module.exports = router;
