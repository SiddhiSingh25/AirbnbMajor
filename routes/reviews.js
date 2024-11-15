const express = require("express");
const reviewRoute = express.Router({mergeParams : true});
let Listing = require("../Models/Listing.js")
let Review = require("../Models/Reviews.js")
const wrapAsync = require("../Utils/wrapAsync.js");
const { loggedIn, validateReview , isAuthor} = require("../middleware.js");
const ReviewController = require("../Controllers/ReviewController.js");


// Review index Route
reviewRoute.post("/", loggedIn, validateReview,  wrapAsync(ReviewController.indexReview))

//delete Route
reviewRoute.delete("/:reviewId", loggedIn, isAuthor, wrapAsync(ReviewController.deleteReview))




module.exports  = reviewRoute