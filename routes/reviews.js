var express=require('express')
// Since router gets separate params we can merge them
var router=express.Router({mergeParams: true})
const reviews = require('../controllers/review')
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')
var catchAsync= require("../utils/catchAsync");


// POST - create new review and associate it with campground
router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview));


// DELETE - delete review associated with campground
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = router;