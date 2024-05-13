const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    //whenever a user registering is already exist then wrapasync will  handle that error 
    //but it will go to lost/random page so to overcome this we use try catch block
    try{
        let {username,email , password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser , password);
    console.log(registeredUser);
    //AUTOMATIC LOGIN AFTER SIGN UP
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
    req.flash("success","Welcome to Wanderlust!");
    res.redirect("/listings");
    });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};


module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success","welcome back to Wanderlust!");
    //res.redirect("/listings");
    //if user login is doing from other routes then ok,
    //if user login from "/listings " then the res.locals.redirectUrl becomes undefined leads to page not found,
    //to overcome this we are checking is res.locals.redirectUrl is empty or not
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return  next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
};