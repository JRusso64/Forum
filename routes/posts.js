var express = require('express');
var Post = require('./../models/post')
var router = express.Router();
// var mongoose = require('mongoose');

router.get('/new', (req, res) => {
    res.render('new', { post: new Post() });
});

router.get('/:id', async (req, res) => {
    let post = await Post.findById({_id: req.params.id})
    if(post == null) res.redirect('/')
    res.render('show', {post: post})
})

router.post('/', async (req, res) => {
    let post = new Post({
        title: req.body.title,
        description: req.body.description
    })
    try{
        await post.save()
        res.redirect(`posts/${post.id}`)
    }catch(e){
        console.log(e)
        res.render('new', {post: post})
    }
    
});

module.exports = router;