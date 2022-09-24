var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
const methodOverride = require('method-override')
const passport = require('passport');
const session = require('express-session');
const Post = require('./models/post');
const bcrypt = require('bcrypt')
const flash = require('express-flash')



dotenv.config();
require('./config/database');
const initializePassport = require('./config/passport')

initializePassport(
  passport,
  async email => await (User.findOne({ email: email })),
  async id => await (User.findById({ _id: id }))
)


var User = require('./models/user')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/posts');
var commentsRouter = require('./routes/comment');

var app = express();

// view engine setup
app.set('views', path.join('./', 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join('./','public')));
app.use(methodOverride('_method'))
app.use(flash())
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())




app.use('/users', usersRouter);
app.use('/posts', postRouter);



app.get('/', checkAuthenticated, async function(req, res, next) {
  const post = await Post.find().sort({ createdAt: 'desc'})
  res.render('index', { posts: post, user: req.user })
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: 'login',
  failureFlash: true
}))


app.get('/register', checkNotAuthenticated,(req, res) => {
  res.render('register');
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  })
  try {
    await user.save()
    res.redirect('/login')
  }catch{
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res, next) => {
  req.logOut(function(err){
    if(err){
      return next(err)
    }
    res.redirect('/login')
  })
})

function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }

  res.redirect('/login')
}


function checkNotAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    res.redirect('/')
  }
  next()
}



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;