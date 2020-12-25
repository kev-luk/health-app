const express = require('express');
const moment = require('moment')
const Food = require('../models/Food');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', async (req, res) => {
    const todayFood = await Food.find({
        date: {
            $gte: moment().startOf('day').toDate(),
            $lte: moment(moment().startOf('day')).endOf('day').toDate()
        }
    }).sort({ date: 'descending' })

    let todayCalories = 0
    todayFood.forEach((food) => {
        todayCalories += food.calories
    })

    res.render('food/food', {
        todayFood: todayFood,
        todayCalories: todayCalories
    });
});

router.get('/entry', (req, res) => {
    res.render('food/foodEntry', {
        food: new Food()
    })
})

router.post('/entry', async (req, res) => {
    let food = new Food({
        name: req.body.name,
        calories: req.body.calories,
        ingredients: req.body.ingredients,
        description: req.body.description,
        userID: req.user.id,
    })

    try {
        food = await food.save()
        res.redirect('/dashboard/food')
    } catch (err) {
        console.log(err)
        res.render('food/foodEntry', { food: food })
    }
});

router.put('/', ensureAuthenticated, (req, res) => {

})

router.delete('/', ensureAuthenticated, (req, res) => {

})

module.exports = router;
