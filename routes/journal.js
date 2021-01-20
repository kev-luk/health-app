const express = require('express');
const router = express.Router();
const moment = require('moment')
const Post = require('../models/Post');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', async (req, res) => {
    const posts = await Post.find().sort({ date: 'descending' })

    res.render('journal/journal', {
        posts: posts
    });
});

router.post('/', async (req, res) => {
    let date;
    try {
        date = moment(new Date(Number(req.body.year), Number(req.body.month) - 1, Number(req.body.day)))

        const posts = await Post.find({
            date: {
                $gte: moment(date).startOf('day').toDate(),
                $lte: moment(moment(date).startOf('day')).endOf('day').toDate()
            }
        }).sort({ date: 'descending' })

        res.render('journal/journal', {
            date: date.format('MM/DD/YYYY'),
            posts: posts
        });
    } catch (err) {
        req.flash('error_msg', 'Please enter numeric values')
        res.redirect('/dashboard/journal')
    }
})

router.post('/entry', ensureAuthenticated, async (req, res) => {
    let post = new Post({
        title: req.body.title,
        rating: req.body.rating,
        entry: req.body.entry,
        userID: req.user.id,
    })

    try {
        post = await post.save()
        req.flash('success_msg', 'Successfully saved post!')
        res.redirect('/dashboard/journal')
    } catch (err) {
        req.flash('error_msg', 'Unable to save post');
        res.send('not registered')
        console.log(err)
    }
});

router.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('journal/journalView', {
        post: post
    })
})

router.put('/:id', async (req, res) => {
    let post = await Post.findById(req.params.id)
    const { title, rating, entry } = req.body
    post.title = title
    post.rating = rating
    post.entry = entry

    try {
        post = await post.save()
        res.redirect(`/dashboard/journal/${post.id}`)
    } catch (err) {
        req.flash('error_msg', 'Unable to save changes')
        res.redirect(`/dashboard/journal/edit/${post.id}`, {
            post: post
        })
    }
})

router.delete('/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id)
    res.redirect('/dashboard/journal')
})

module.exports = router;