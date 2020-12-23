const express = require('express');
const Food = require('../models/Food');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => {
    res.render('food');
});

router.get('/entry', (req, res) => {
    res.render('foodEntry')
})

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

router.patch('/edit', ensureAuthenticated, (req, res) => {

})

router.delete('/', ensureAuthenticated, (req, res) => {

})

module.exports = router;
