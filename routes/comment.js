var express = require('express')
var router = express.Router();
var Post = require('./../models/post')

router.put('/posts/:id/comments', async () => {
    let post = await Post.findOne({_id: req.params.id});
    console.log(req.body)
    try{
        post.comments.push(req.body)
        res.redirect(`/posts/${req.params.id}`);
    }catch(e){
        res.redirect('/')
    }
});

module.exports = router;