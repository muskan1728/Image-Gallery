var express=require('express')
// Since router gets separate params we can merge them
var router=express.Router({mergeParams: true})

var Campground=require('../models/campground')
var Review = require('../models/review');

// var middleware = require('../middleware/')
var catchAsync= require("../utils/catchAsync"),
ExpressError = require('../utils/ExpressError');

var { reviewSchema } = require("../schemas.js");
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/',validateReview,catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully added a new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId',catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;