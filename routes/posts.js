var express = require('express');
var Post = require('./../models/post')
var router = express.Router();
// var mongoose = require('mongoose');

router.get('/new', (req, res) => {
    res.render('new', { post: new Post() });
})

router.get('/edit/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('edit', {post: post})
})

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

router.delete('/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

router.put('/:id', async (req, res) => {
    post = req.body
    post.title = req.body.title
    post.description = req.body.description

    
    let update = await Post.findById(req.params.id)

    await Post.updateOne({_id: req.params.id}, post)

    try{
        update = await Post.save()
        console.log('success')
        res.redirect(`/posts/${req.params.id}`)
    }catch(e){
        res.redirect(`/posts/${req.params.id}`)
    }
})

module.exports = router;