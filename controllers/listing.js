const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient= mbxGeocoding({accessToken:mapToken});


module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner"); //populate->for showing full review object
  if (!listing) {
    //when ever a user trying to access a listing which deleted then this message will be displyed nd redirected to index page
    req.flash("error", "Listing you requested does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  //MAPS
 let response= await geocodingClient.forwardGeocode({
   // query: "New Delhi, India",
   query: req.body.listing.location,
    limit: 1
  })
    .send();
    

  //extracting image url and filename from cloudinary storage
  let url = req.file.path;
  let filename = req.file.filename;

  // let {title,description,image,price,county,location}=req.body;
  const newListing = new Listing(req.body.listing); //to create new instance in database of user inputed data
  newListing.owner = req.user._id;
  newListing.image = { url, filename }; //and adding into mongo

  newListing.geometry=response.body.features[0].geometry;
  let savedListing= await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created!"); //alert/flash message is appeared whenever a new listing is created
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl= originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing ,originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  //extracting image url and filename from cloudinary storage
  if(typeof req.file!== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();

  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
