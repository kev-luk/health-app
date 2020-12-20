const express = require('express');
const bcrypt = require('bcryptjs')
const User = require('../Models/User');
const router = express.Router();

// login page
router.get('/', (req, res) => {
    res.send('login page');
});

router.post('/login', (req, res) => {

})

// register page
router.get('/register', async (req, res) => {
    let emailExist = await User.findOne({ email: req.body.email })

    if (emailExist) {
        // display message that email already exists
        res.render('login/register', { user: user })
    }

    // hash password
    const salt = await bcrypt.genSalt(25)
    let hashPassword = await bcrypt(req.body.password, salt)

    let user = new User({
        name: req.body.name,
        username: req.body.username,
        password: hashPassword
    })

    try {
        user = user.save()
        res.redirect('/login')
    } catch {
        console.log(e)
        res.render('login/register', { user: user })
    }
});

module.exports = router;