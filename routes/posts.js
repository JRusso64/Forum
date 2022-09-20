var express = require('express');
const Post = require('../models/post')
var router = express.Router();

router.get('/new', (req, res) => {
    res.render('new', { post: new Post() });
});

router.get('/:id', (req, res) => {
    const post = Post.findById(req.params.id)
    if(post == null) redirect('/')
    res.render('show', { post: post })
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
        res.render('posts/new', {post: post})
    }
    
});

module.exports = router;