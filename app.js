var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  ejsMate = require('ejs-mate'),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  flash = require("connect-flash"),
  methodOverride = require("method-override"),
  path = require("path"),
  catchAsync= require("./utils/catchAsync"),
  ExpressError = require('./utils/ExpressError'),
  { campgroundSchema } = require('./schemas.js'),

Campground =require('./models/campground');
// User       = require('./models/user')
// seedDB     =require('./seeds')
// Comment    =require('./models/comment')
// User       =require('./models/user')

//requiring routes
// var commentRoutes = require('./routes/comments'),
//     campgroundRoutes = require('./routes/campgrounds'),
//     indexRoutes = require('./routes/index')

mongoose.connect('mongodb://localhost:27017/yelp_camp_1', {useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.use(bodyParser.urlencoded({extended:true}))
app.engine('ejs',ejsMate)
app.set("view engine", "ejs");
app.set('views',path.join(__dirname,'views'))
// // __dirname shows the path of current directory
// app.use(express.static(__dirname+'/public'))
app.use(methodOverride('_method'));
// app.use(flash());
// // seedDB();   // seedthe database

// // PAASPORT SESSION
// app.use(require('express-session')({
//     secret:'once again love won',
//     resave:false,
//     saveUninitialized: false
// }))

// app.use(passport.initialize());
// app.use(passport.session())
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// // in order to give status of current user to each website
// app.use(function(req,res,next){
//     res.locals.currentUser=req.user;
//     res.locals.error=req.flash('error')
//     res.locals.success=req.flash('success')
//     next();
// })
// app.use(indexRoutes);
// app.use('/campgrounds',campgroundRoutes);
// app.use('/campgrounds/:id/comments',commentRoutes);


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
app.get("/",(req,res)=>{
    res.render('home')
})

app.get("/campgrounds",async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

app.get("/campgrounds/new",(req,res)=>{
    res.render('campgrounds/new');
})
app.post('/campgrounds', validateCampground,catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))
app.get("/campgrounds/:id",catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
    
}))


app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id',validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))
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
