var express=require('express')
// Since router gets separate params we can merge them
var router=express.Router({mergeParams: true})
var Campground=require('../models/campground')
var Review = require('../models/review');
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')
var catchAsync= require("../utils/catchAsync");
router.post('/',isLoggedIn,validateReview,catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    console.log(review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully added a new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;