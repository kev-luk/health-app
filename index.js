if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const path = require('path')
const cors = require('cors')
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRouter = require('./routes/auth')
const foodRouter = require('./routes/food');
const exerciseRouter = require('./routes/exercise');
const PORT = process.env.PORT || 3000;
const url = process.env.MONGO_URI;

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/views"))

app.use(cors())
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res) => {
    res.render('welcome');
});

app.use('/auth', authRouter)
app.use('/food', foodRouter);
app.use('/exercise', exerciseRouter);


app.listen(PORT, () => {
    console.log('Server is running...');
});
