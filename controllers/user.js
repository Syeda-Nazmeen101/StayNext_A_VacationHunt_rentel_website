const User = require("../models/User.js");

module.exports.renderSignup = (req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signup = async(req,res)=>{
    try{
    let {username,email,password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome To WanderLust");
        res.redirect("/listing");
    });
  }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render("user/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success" ,"Welcome back to Wanderlust!");
    let redirectUrl =  res.locals.redirectUrl || "/listing"
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listing");
    });
}