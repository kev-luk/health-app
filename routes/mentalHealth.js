const express = require('express');
const router = express.Router();
const moment = require('moment')
const Post = require('../models/Post');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', async (req, res) => {
    const todayPosts = await Post.find({
        date: {
            $gte: moment().startOf('day').toDate(),
            $lte: moment(moment().startOf('day')).endOf('day').toDate()
        }
    }).sort({ date: 'descending' })

    res.render('mental-health/diary', {
        todayPosts: todayPosts
    });
});

router.get('/entry', ensureAuthenticated, async (req, res) => {
    res.render('mental-health/diaryEntry', {
        post: new Post()
    })
});

router.get('/entry/:id', (req, res) => {
    const postID = req.params.id
    const post = Post.findById(postID)

    res.render('mental-health/show', {
        post: post
    })
})

router.post('/entry', ensureAuthenticated, async (req, res) => {
    let post = new Post({
        title: req.body.title,
        description: req.body.description,
        rating: req.body.rating,
        entry: req.body.entry,
        userID: req.user.id,
    })

    try {
        post = await post.save()
        req.flash('success_msg', 'Successfully saved post!')
        res.redirect('/dashboard/mental-health')
    } catch (err) {
        req.flash('error_msg', 'Unable to save post');
        res.send('not registered')
        console.log(err)
    }
});

router.patch('/edit', ensureAuthenticated, (req, res) => {

})

router.delete('/', ensureAuthenticated, (req, res) => {

})

module.exports = router;