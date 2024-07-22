if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
var express = require("express");
  app = express(),
  bodyParser = require("body-parser"),
  path = require("path"),
  mongoose = require("mongoose"),
  ejsMate = require('ejs-mate'),
  session = require('express-session'),
  flash = require("connect-flash"),
  ExpressError = require('./utils/ExpressError'),
  methodOverride = require("method-override"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),

  campgroundRoutes = require('./routes/campgrounds'),
  reviewRoutes = require('./routes/reviews');
  userRoutes = require('./routes/users');

  User       = require('./models/user')
// seedDB     =require('./seeds')
// Comment    =require('./models/comment')

//requiring routes
// var commentRoutes = require('./routes/comments'),

//     indexRoutes = require('./routes/index')

mongoose.connect('mongodb://localhost:27017/yelp_camp_1', {useNewUrlParser: true,useCreateIndex:true, useUnifiedTopology: true ,useFindAndModify: false});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.engine('ejs',ejsMate)
app.set("view engine", "ejs");
app.set('views',path.join(__dirname,'views'))

app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride('_method'));
// __dirname shows the path of current directory
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
  secret:'thisshouldbeabettersecret',
  resave:false,
  saveUnitialized:true,
  cookie:{
    httpOnly: true,
    expires:Date.now() + 1000 * 60 * 60 * 24 * 7, //1 week
    maxAge: 1000 * 60 * 60 * 24 * 7
  }

}
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

// how to store user in session
passport.serializeUser(User.serializeUser());
// how to get user out from session
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

// // seedDB();   // seedthe database

// // PAASPORT SESSION
// app.use(require('express-session')({
//     secret:'once again love won',
//     resave:false,
//     saveUninitialized: false
// }))

// // in order to give status of current user to each website
// app.use(function(req,res,next){
//     res.locals.currentUser=req.user;
//     res.locals.error=req.flash('error')
//     res.locals.success=req.flash('success')
//     next();
// })
// app.use(indexRoutes);
app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);

// app.use('/campgrounds/:id/comments',commentRoutes);



app.all("*",(req,res,next)=>{
    next(new ExpressError("Page Not FOund",404))
})
app.use((err,req,res,next)=>{
    // console.error(err.stack);
    const { statusCode = 500} = err;
    if (!err.message) err.message = 'Something broke!'

    // res.status(statusCode).send(message);  // 500 status code means server error
    res.status(statusCode).render("error", { err });  // 500 status code means server error
})
var port = process.env.PORT || 3008;
app.listen(port, function () {
  console.log("YelpCamp  Has Started!");
});
