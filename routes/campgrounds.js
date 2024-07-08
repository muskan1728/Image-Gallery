var express=require('express')
var router=express.Router()
var Campground=require('../models/campground')
var middleware = require('../middleware/')

// INDEX - show all campgrounds
router.get('/',function(req,res){
    console.log(req.user)
    // Get all campgrounds from db
    Campground.find({}, function(err,Allcampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render('campgrounds/index',{campgrounds:Allcampgrounds});
        }
    });
});

// CREATE-add new campground to DB
// here campgrounds serve for post
router.post('/',middleware.isLoggedIn,function(req,res){
    
    // get data from form and add to campground array
    var name=req.body.name;
    var image=req.body.image;
    var desc =req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var price = req.body.price
    console.log(author)
    var newCampground={name:name,image:image,description:desc,author:author,price:price}
    
    
    // create new campground and save it to database
    Campground.create(newCampground,function(err,newlyCreated){
    if(err){
        
        console.log(err)
    }else{
        // redirect back to campground page
        console.log(newlyCreated)
        res.redirect('/campgrounds')
    }
})
})

router.get('/new' ,middleware.isLoggedIn,function(req,res){
    res.render('campgrounds/new')

})

// SHOW- viewing more about particular campground
router.get('/:id',function(req,res){
    // find campground with provided id 
    // this populate is used to find all comments from their ids
    Campground.findById(req.params.id).populate('comments').exec(function(err,foundCampground){
        if(err){
            console.log(err)
        }else{
            console.log(foundCampground);
            
            // ṛender show template with that campground
            res.render('campgrounds/show',{campground:foundCampground})
        }
        
    })
})

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit',middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
                // console.log(foundCampground.author.id) // foundCampground.author.id is mongoose object
                // console.log(req.user._id) //req.user._id is string       
        res.render('campgrounds/edit',{campground:foundCampground}); 
    })
});
// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    // find and update the correct campground
    
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect('/campgrounds');
        } else{
            res.redirect('/campgrounds/' +req.params.id)
        }
    })
    // ṛedirect somewhere
})

// Destroy campground route
router.delete('/:id',middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect('/campgrounds');
        }else{
            res.redirect('/campgrounds');
        }
    })
  
   
})

module.exports=router;
