const Listing = require("../Models/Listing");
const Review = require("../Models/Reviews")


//Index review controller
module.exports.indexReview = async (req, res) => {
    let _id = req.params.id;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id;
    listing.review.push(newReview);
    await newReview.save()
    await listing.save()
    res.redirect(`/listings/${_id}`)
}


//Delete review controller
module.exports.deleteReview = async (req, res) => {
    let _id = req.params.id;
    let reviewId = req.params.reviewId;
    await Listing.findByIdAndUpdate(_id, {$pull : {review : reviewId}})//remove fron  listing review array
    await Review.findByIdAndDelete(reviewId)//only remove from review 
    res.redirect(`/listings/${_id}`)
}