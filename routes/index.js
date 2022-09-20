var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const posts = [{
    title: 'Test Post',
    createdAt: new Date(),
    description: 'Test Description'
  },
  {
    title: 'Test Post 2',
    createdAt: new Date(),
    description: 'Test Description 2'
  }]
  res.render('index', {posts: posts});
});



module.exports = router;
