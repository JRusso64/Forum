var express = require('express');
var router = express.Router();
const Post = require('.././models/post')

/* GET home page. */
router.get('/', async function(req, res, next) {
  const post = await Post.find()
  res.render('index', { posts: post })
});



module.exports = router;
