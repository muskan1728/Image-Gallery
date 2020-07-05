var express    =require('express'),
    app        =express(),
    bodyParser =require('body-parser'),
    mongoose   =require('mongoose'),
    passport   =require('passport'),
    LocalStrategy = require('passport-local'),
    flash        = require('connect-flash'),
    methodOverride = require('method-override'),
    Campground =require('./models/campgrounds'),
    User       = require('./models/user')
    seedDB     =require('./seeds')
    Comment    =require('./models/comment')
    User       =require('./models/user')

//requiring routes
var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index')

 
mongoose.connect('mongodb://localhost/yelp_camp_9', {useNewUrlParser: true, useUnifiedTopology: true });  
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')
// __dirname shows the path of current directory
app.use(express.static(__dirname+'/public'))
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();   // seedthe database 


// PAASPORT SESSION
app.use(require('express-session')({
    secret:'once again love won',
    resave:false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// in order to give status of current user to each website
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash('error')
    res.locals.success=req.flash('success')
    next();
})
app.use(indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
var port = process.env.PORT || 3008;
app.listen(port, function () {
console.log("YelpCamp  Has Started!");
});
