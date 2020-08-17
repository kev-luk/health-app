if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const foodRouter = require('./Routes/food');
const exerciseRouter = require('./Routes/exercise');
const PORT = process.env.PORT || 3000;
const url = process.env.MongoURI;

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

app.use('/food', foodRouter);
app.use('/exercise', exerciseRouter);

app.listen(PORT, () => {
    console.log('Server is running...');
});
