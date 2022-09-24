var express = require('express');
var Post = require('./../models/post')
var Comments = require('./../models/comment')
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


router.post('/:id/comments', checkAuthenticated, async (req, res) => {
    let post = await Post.findById(req.params.id);
    if(req.user.id == post.user){
        res.json({"auth": "not authorized"})
    }else{
        try{
            console.log(req.body.content)
            let comment = new Comments({
                content: req.body.content,
                user: req.user
            })
            post.comments.push(comment)
            post.save()
            res.redirect(`/posts/${req.params.id}`);
        }catch(e){
            res.redirect('/')
        }
    }
});

router.post('/:id/:cid/comments/', async (req, res) => {
    
    let post = await Post.findById(req.params.id);
    
    var commentArray = post.comments;

    console.log(req.user.id)
    console.log(commentArray[0].user.toString())
    for(var i = 0; i < commentArray.length; i++){
        if(commentArray[i].id == req.params.cid && (req.user.id) === (commentArray[i].user.toString())){
            commentArray.splice(i, 1);
        }
    }

    post.update({comments: commentArray})
    await post.save()

    res.redirect(`/posts/${req.params.id}`);
})

function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }

  res.redirect('/login')
}


module.exports = router;