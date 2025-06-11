const Listing  = require("../models/listing.js");
const Review =  require("../models/review.js");

module.exports.addReview = async(req,res)=>{
    
    let listings = await Listing.findById(req.params.id);
    console.log("listing is found");

    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    console.log(newreview);
    listings.reviews.push(newreview);
      
    await newreview.save();
    await listings.save();
                                  
    // console.log("new review saved");
    req.flash("success","Review added");
    res.redirect(`/listing/${req.params.id}`);
}

module.exports.deleteReview = async (req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted");
    res.redirect(`/listing/${id}`);
}