let Listing = require("./Models/Listing.js");
const Review = require("./Models/Reviews.js");
const {listingSchema , reviewSchema} = require("./schema.js")
const ExpressError = require('./Utils/ExpressError.js');

module.exports.loggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "You must be logged IN!");
        return res.redirect("/user/logIn");
    }
    next();
}

module.exports.storeUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner = async(req,res,next)=>{
    let _id = req.params.id;
    console.log(req.params)
    let listing = await Listing.findById(_id);
    console.log(listing)
    if(res.locals.currUser && !listing.owner._id .equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of the listing!");
        return  res.redirect(`/listings/${_id}`)
    }
    next()
}


module.exports.validateSchema = (req,res, next)=>{
    let {error} =listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error)
    }
    else{
        next()
    }
}  


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(", ");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
};


module.exports.isAuthor = async(req,res,next)=>{
    let id =  req.params.id;
    let reviewId = req.params.reviewId;
    let review = await Review.findById(reviewId);
    if(res.locals.currUser && !review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of the review!");
        return  res.redirect(`/listings/${id}`)
    }
    next()
}