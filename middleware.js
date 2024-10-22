const Listing = require("./models/listing");
const Review = require("./models/review");
//for server side validation for forms
const {listingschema}=require("./schema.js");
const ExpressError= require("./utils/ExpressError.js");
//for server side validation for forms
//const {listingschema}=require("../schema.js");
const {reviewSchema}=require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{
    //req.isAuthenticated is used to check whether user is already logged in or not ->it is passport method
  if(!req.isAuthenticated()){
    req.session.redirectUrl =req.originalUrl;
    req.flash("error","you must be logged in to create listing!");
   return res.redirect("/login");
  }
  next();
};


//after successful login passport will reset session.redirectUrl to undefined,so before reset we will store it in localvariables so we can use whereever we want
module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

//IS LOGGED IN USER IS equals to LISTING OWNER OR NOT MIDDLEWARE->FOR AUTHORIZATION
module.exports.isOwner = async (req,res,next)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","you don't have permission to edit");
    return res.redirect(`/listings/${id}`);
  }
  next();
  
};

//SCHEMA VALIDATION FUNCTION->middleware
module.exports.validateListing = (req,res,next)=>{
  let {error} = listingschema.validate(req.body);

  if(error){
    let errorMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, errorMsg);
  }else{
    next();
  }
};

//SCHEMA VALIDATION FOR REVIEWS
module.exports.validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
    //let {error}=reviewSchema(req.body);

  if(error){
    let errorMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, errorMsg);
  }else{
    next();
  }
};


module.exports.isReviewAuthor = async (req,res,next)=>{
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","you are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
  
};
