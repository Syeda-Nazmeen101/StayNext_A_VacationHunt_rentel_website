const express = require("express");
const router = express.Router();
const wrapASYNC = require("../utils/wrapAsunc.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedin,isOwner} = require("../middelware.js");

const listingController = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const validateListing = (req,res,next) =>{
    let {err} = listingSchema.validate(req.body);
    if(err){
        throw new ExpressError(400,err);
    }
    next();
}

router.route("/")
//index Route
.get(
    wrapASYNC(listingController.index))
//Create Route
.post(
    isLoggedin,
    // validateListing, 
    upload.single('listing[image]'),
    wrapASYNC(listingController.createListing));




//New route
router.get("/new",isLoggedin,listingController.renderNewListing);

router
    .route("/:id")
//read or show Route
    .get(
     validateListing, 
     wrapASYNC(listingController.showListing))
//update Route
    .put(
        isLoggedin,
        isOwner,
        upload.single('listing[image]'),
        validateListing, 
        wrapASYNC(listingController.updateListing))
//delete Route
    .delete(
        isLoggedin,
        isOwner,
        validateListing, 
        wrapASYNC(listingController.destroyListing));
        
//Edit Route
router.get("/:id/edit",
    isLoggedin,
    isOwner, 
    validateListing, wrapASYNC(listingController.editListing));

module.exports = router;






// //Create Route
// router.post("/",validateListing, wrapASYNC( listingController.createListing
//     // let result = listingSchema.validate(req.body);
//     // console.log(result);
//     // if(result.error){
//     //     throw new ExpressError(400,result.error);
//     // }
//     // if(!req.body.listing){
//     //     throw new ExpressError(400,"send valid data for listing");
//     // }
//   ));