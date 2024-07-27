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
  MongoStore = require('connect-mongo'),

  flash = require("connect-flash"),
  methodOverride = require("method-override"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  helmet = require("helmet"),
  ExpressError = require('./utils/ExpressError'),
  campgroundRoutes = require('./routes/campgrounds'),
  reviewRoutes = require('./routes/reviews');
  userRoutes = require('./routes/users');
  User       = require('./models/user')
  const mongoSanitize = require('express-mongo-sanitize');
  const dbUrl=process.env.DB_URL
// 'mongodb://localhost:27017/yelp_camp_1'

mongoose.connect(dbUrl, {useNewUrlParser: true,useCreateIndex:true, useUnifiedTopology: true ,useFindAndModify: false});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// registers the ejs-mate engine as the template engine for files with the .ejs extension.
app.engine('ejs',ejsMate)
// This line sets the default templating engine to EJS.
app.set("view engine", "ejs");
// Set the directory for view files
app.set('views',path.join(__dirname,'views'))
// Third-party Middleware: Parse incoming request bodies
app.use(bodyParser.urlencoded({extended:true}))
// methodOverride allows to use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
app.use(methodOverride('_method'));
// __dirname shows the path of current directory
// Built-in Middleware: Serve static files
app.use(express.static(path.join(__dirname,'public')))
// remove or prohibit objects that begin wiht $ sign or contain . from req.body, req.qery,req.params
app.use(mongoSanitize());
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: 'thisshouldbeabettersecret!'
  }
});
const sessionConfig = {
  store,
  name:'session',  // session cookie name, default: connect.sid
  secret:'thisshouldbeabettersecret',
  resave:false,
  saveUnitialized:true,
  cookie:{
    httpOnly: true,
    // secure: true,
    expires:Date.now() + 1000 * 60 * 60 * 24 * 7, //1 week
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
//  helps manage flash messages, which are temporary messages that are typically used to provide feedback to users after a redirect
app.use(flash());
app.use(helmet())

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/dm4vhlkiq/", 
              "https://images.unsplash.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);

// authentication middleware
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

app.get('/', (req, res) => {
  res.render('home')
});

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
