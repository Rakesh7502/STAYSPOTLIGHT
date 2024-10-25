const express= require("express");
const router = express.Router({mergeParams:true})  ;

const wrapAsync=require("../utils/wrapAsync.js");
const Review = require("../models/review.js"); 
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");


const reviewController = require("../controllers/reviews.js");
//const reviewController = require("../controllers/reviews.js");



 //REVIEWS
// POST REVIEW ROUTE->to create a review
//using validateReview function as a middleware
//wrapAsync for error handling
router.post("/", 
isLoggedIn,
validateReview, 
wrapAsync(reviewController.createReview));
  
  //DELETE REVIEW ROUTE
  router.delete("/:reviewId" ,
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview));

  module.exports= router;
  
  
