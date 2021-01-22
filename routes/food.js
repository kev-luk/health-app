const express = require('express');
const moment = require('moment')
const Food = require('../models/Food');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, async (req, res) => {
    const todayFood = await Food.find({
        userID: req.user.id,
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
        todayCalories: todayCalories,
        days: getDays(moment().format()),
        weekCalories: await caloriesPerDay(moment().format(), req.user.id),
        calorieBreakdown: todayFood.map(x => x.calories).reverse(),
        meals: todayFood.map(x => x.name).reverse(),
    });
});

router.post('/', ensureAuthenticated, async (req, res) => {
    let date;
    try {
        date = moment(new Date(Number(req.body.year), Number(req.body.month) - 1, Number(req.body.day)))

        const todayFood = await Food.find({
            userID: req.user.id,
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
            todayCalories: todayCalories,
            days: getDays(date),
            weekCalories: await caloriesPerDay(date, req.user.id),
            calorieBreakdown: todayFood.map(x => x.calories).reverse(),
            meals: todayFood.map(x => x.name).reverse(),
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

router.get('/:id', ensureAuthenticated, async (req, res) => {
    const food = await Food.findById(req.params.id)
    res.render('food/foodView', {
        food: food
    })
})

router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    const food = await Food.findById(req.params.id)
    res.render('food/foodEdit', {
        food: food
    })
})

router.put('/:id', ensureAuthenticated, async (req, res) => {
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

router.delete('/:id', ensureAuthenticated, async (req, res) => {
    await Food.findByIdAndDelete(req.params.id)
    res.redirect('/dashboard/food')
})

function getDays(date) {
    const dates = []
    const NUM_OF_DAYS = 7

    for (let i = 0; i < NUM_OF_DAYS; i++) {
        let o = moment(date).subtract(i, 'day').format('MM-DD')
        dates.push(o);
    }

    return dates.reverse();
}

async function caloriesPerDay(date, id) {
    const calories = []
    const NUM_OF_DAYS = 7

    for (let i = 0; i < NUM_OF_DAYS; i++) {
        const o = moment(date).subtract(i, 'day')

        const dayCalories = await Food.find({
            userID: id,
            date: {
                $gte: moment(o).startOf('day').toDate(),
                $lte: moment(moment(o).startOf('day')).endOf('day').toDate()
            },
        })

        let totalDay = 0
        dayCalories.forEach((food) => {
            totalDay += food.calories
        })

        calories.push(totalDay)
    }

    return calories.reverse()
}

module.exports = router;
