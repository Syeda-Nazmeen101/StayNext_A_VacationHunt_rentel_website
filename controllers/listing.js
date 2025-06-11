const Listing = require("../models/listing");

module.exports.index = async(req,res,next)=>{
    const allListing = await Listing.find({});
    res.render("listing/index.ejs",{allListing});
};

module.exports.renderNewListing= (req,res)=>{
    res.render("listing/new.ejs");
};

module.exports.showListing = (async(req,res,next)=>{
    // let {id} = req.params;
    const listing = await Listing.findById(req.params.id).populate("reviews").populate("owner");
    // console.log(listing);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listing/show.ejs",{listing});
});

module.exports.createListing = (async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    
    let listing= req.body.listing;
    let L = new Listing(listing);
    L.owner = req.user._id;
    L.image = {url,filename};
    await L.save();
    req.flash("success","new listing is added");
    // console.log(L);
    res.redirect("/listing");
});

module.exports.editListing = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    let originalIgUrl = listing.image.url;
    originalIgUrl.replace("/upload","/upload/w_250");
    res.render("listing/edit.ejs",{listing});
}

module.exports.updateListing = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing}) //decontructing
    
    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    
    req.flash("success","Listing Updated");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing = async(req,res,next)=>{
    let {id} = req.params;
    let deletedl = await Listing.findByIdAndDelete(id);
    console.log(deletedl);
    req.flash("success","Listing is Deleted");
    res.redirect("/listing");
};