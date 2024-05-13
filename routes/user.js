const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/users.js")

//SIGNUP
router.get("/signup",userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));


//LOGIN
router.get("/login",userController.renderLoginForm);

//passport.authenticate is used as a route middleware to authenticate users/requests
router.post(
    "/login" , 
    saveRedirectUrl,//MW=>after login it will redirected to page where user left
passport.authenticate("local",
 { failureRedirect : '/login' ,
 failureFlash : true
}) ,
userController.login
);

//LOGOUT
router.get("/logout" ,userController.logout);

module.exports = router;