const express = require("express");
const router = express.Router({mergeParams:true});
const wrapASYNC = require("../utils/wrapAsunc.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedin} =require("../middelware.js");
const { addReview, deleteReview } = require("../controllers/review.js");

//review validation
const validateReview = (req,res,next) =>{
    let {err} = reviewSchema.validate(req.body);
    if(err){
        throw new ExpressError(400,err);
    }
    next();
}

//Reviews
//add review route
router.post("/",
    isLoggedin,
    validateReview , wrapASYNC(addReview));

//delete review route
router.post("/:reviewId" , wrapASYNC(deleteReview));

module.exports = router;