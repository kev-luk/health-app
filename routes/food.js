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
        date: moment().format('L'),
        todayFood: todayFood,
        todayCalories: todayCalories
    });
});

router.post('/', async (req, res) => {
    let date;
    try {
        date = moment(new Date(Number(req.body.year), Number(req.body.month) - 1, Number(req.body.day)))

        const todayFood = await Food.find({
            date: {
                $gte: moment(date).startOf('day').toDate(),
                $lte: moment(moment(date).startOf('day')).endOf('day').toDate()
            }
        }).sort({ date: 'descending' })

        let todayCalories = 0
        todayFood.forEach((food) => {
            todayCalories += food.calories
        })

        res.render('food/food', {
            date: date.format('MM/DD/YYYY'),
            todayFood: todayFood,
            todayCalories: todayCalories
        });
    } catch (err) {
        req.flash('error_msg', 'Please enter numeric values')
        res.redirect('/dashboard/food')
    }
})

router.post('/entry', ensureAuthenticated, async (req, res) => {
    if (!req.body.name) {
        req.flash('error_msg', 'Please enter a meal name')
        res.redirect('/dashboard/exercise')
    } else if (!req.body.calories) {
        req.flash('error_msg', 'Please enter the amount of calories consumed')
        res.redirect('/dashboard/exercise')
    } else {
        let food = new Food({
            name: req.body.name,
            calories: req.body.calories,
            carbs: req.body.carbs,
            protein: req.body.protein,
            fat: req.body.fat,
            ingredients: req.body.ingredients,
            userID: req.user.id,
        })

        try {
            food = await food.save()
            res.redirect('/dashboard/food')
        } catch (err) {
            console.log(err)
            res.render('dashboard/food', { food: food })
        }
    }
});

router.get('/:id', async (req, res) => {
    const food = await Food.findById(req.params.id)
    res.render('food/foodView', {
        food: food
    })
})

router.get('/edit/:id', async (req, res) => {
    const food = await Food.findById(req.params.id)
    res.render('food/foodEdit', {
        food: food
    })
})

router.put('/:id', async (req, res) => {
    let food = await Food.findById(req.params.id)
    const { name, calories, carbs, protein, fat, ingredients } = req.body
    food.name = name
    food.calories = calories
    food.carbs = carbs
    food.protein = protein
    food.fat = fat
    food.ingredients = ingredients

    try {
        food = await food.save()
        req.flash('success_msg', 'Successfully updated')
        res.redirect(`/dashboard/food/${food.id}`)
    } catch (err) {
        req.flash('error_msg', 'Unable to save changes')
        res.redirect(`/dashboard/food/edit/${food.id}`, {
            food: food
        })
    }
})

router.delete('/:id', async (req, res) => {
    await Food.findByIdAndDelete(req.params.id)
    res.redirect('/dashboard/food')
})

module.exports = router;
