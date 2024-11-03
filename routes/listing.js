const express = require("express");
const router = express.Router({ mergeParams: true });
//const express = require("express");
//const router = express.Router({ mergeParams: true });


const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
//for server side validation for forms
//const {reviewSchema}=require("../schema.js");

//middleware to check whether user is loggedin or not
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//CONTROLLERS
const listingController = require("../controllers/listing.js");

//IMAGE UPLOAD VIA MULTER
const multer = require("multer");
const { storage } = require("../cloudConfig.js"); //storing in cloud
const upload = multer({ storage }); //parsing the file

//ROUTER.route->naming it as router.route if multiple routes has same path,then we can write it in only one block
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing, //->IT IS MIDDLEWARE ONCE USER SEND A REQ THEN IT CHECK FOR SCHEMA VALIDAION once schema is validated then only it proceed
  wrapAsync(listingController.createListing)
  );
  

//EDIT route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//INDEX route->shows all the listings
// router.get("/",wrapAsync(listingController.index));

//NEW route->to create new listing
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

//SHOW route->details information of a particular listing
router.get("/:id", wrapAsync(listingController.showListing));

//CREATE route
//to input a new listing and save it to DB and redirect to listing page
// router.post("/",
// validateListing, //->IT IS MIDDLEWARE ONCE USER SEND A REQ THEN IT CHECK FOR SCHEMA VALIDAION once schema is validated then only it proceed
// wrapAsync(listingController.createListing));
//router.get("/:id", wrapAsync(listingController.showListing));
//EDIT route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//UPDATE route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing)
);

//DELETE route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
