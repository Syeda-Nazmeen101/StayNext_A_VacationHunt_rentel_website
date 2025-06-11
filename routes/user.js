const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/User.js");
const passport = require("passport");
const wrapASYNC = require("../utils/wrapAsunc.js");
const flash = require("connect-flash");
const { saveRedirectUrl } = require("../middelware.js");

const usercontroller = require("../controllers/user.js");

router
   .route("/signup")
        .get(usercontroller.renderSignup)
        .post(usercontroller.signup);

router
   .route("/login")
        .get(usercontroller.renderLogin)
        .post( 
        saveRedirectUrl,
        passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true,
        }),usercontroller.login);

//logout
router.get("/logout",usercontroller.logout);

module.exports = router;