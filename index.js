if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const path = require('path')
const cors = require('cors')
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user')
const dashboardRouter = require('./routes/dashboard')
const exerciseRouter = require('./routes/exercise')
const foodRouter = require('./routes/food')
const journalRouter = require('./routes/journal')
const methodOverride = require('method-override')
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const PORT = process.env.PORT || 3000;
const url = process.env.MONGO_URI;

const app = express();

require('./config/passport')(passport);

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.log(err));

// app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(cors())

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.json())

app.use(
    session({
        secret: process.env.PRIVATE_KEY,
        resave: true,
        saveUninitialized: true,
        cookie: {
            path: '/',
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60,
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', dashboardRouter)
app.use('/user', userRouter)
app.use('/dashboard/food', foodRouter)
app.use('/dashboard/exercise', exerciseRouter)
app.use('/dashboard/journal', journalRouter)

app.use((req, res) => {
    res.status(404).render('e404')
})

app.listen(PORT, () => {
    console.log('Server is running...');
});
