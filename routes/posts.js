var express = require('express');
var Post = require('./../models/post')
var router = express.Router();
// var mongoose = require('mongoose');

router.get('/new', checkAuthenticated, (req, res) => {
    res.render('new', { post: new Post()});
})

router.get('/edit/:id', checkAuthenticated, async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('edit', {post: post})
})

router.get('/:id', checkAuthenticated, async (req, res) => {
    let post = await Post.findById({_id: req.params.id})
    if(post == null) res.redirect('/')
    res.render('show', {post: post, user: req.user})
})

router.post('/', checkAuthenticated, async (req, res) => {

    let post = new Post({
        title: req.body.title,
        description: req.body.description,
        user: req.user.id
    })
    try{
        await post.save()
        res.redirect(`posts/${post.id}`)
    }catch(e){
        console.log(e)
        res.render('new', {post: post})
    }
    
});

router.delete('/:id', checkAuthenticated, async (req, res) => {
    let post = await Post.findById(req.params.id)
    if((post.user).equals(req.user.id)){
        await Post.findByIdAndDelete(req.params.id)
        res.redirect('/')
    }else{
        res.json({"auth": "Not Authorized"})
    }
    
})

router.put('/:id', checkAuthenticated, async (req, res) => {
    post = req.body
    post.title = req.body.title
    post.description = req.body.description

    
    let update = await Post.findById(req.params.id)
    if((update.user).equals(req.user.id)){
        await Post.updateOne({_id: req.params.id}, post)

        try{
            update = await Post.save()
            console.log('success')
            res.redirect(`/posts/${req.params.id}`)
        }catch(e){
            res.redirect(`/posts/${req.params.id}`)
        }
    }else{
        res.json({"auth": "Not Authorized"})
    }



    
})

function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }

  res.redirect('/login')
}


module.exports = router;