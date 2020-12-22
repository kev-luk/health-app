const express = require('express');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User');
const router = express.Router();

// register page
router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/register', async (req, res) => {
    let emailExist = await User.findOne({ email: req.body.email })

    if (emailExist) {
        return res.status(400).send('email already in use')
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    let hashPassword = await bcrypt.hash(req.body.password, salt)

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })

    try {
        user = await user.save()
        console.log('USER CREATED')
        res.redirect('/auth/login')
    } catch (err) {
        res.send('not registered')
        console.log(err)
    }
});

// login page
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).send('Email or password is incorrect')
    }

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) {
        return res.status(400).send('Email or password is incorrect')
    }

    // create and assign token
    const token = jwt.sign({ _id: user._id }, process.env.PRIVATE_KEY)
    res.header('auth-token', token).send(token)
})

module.exports = router;