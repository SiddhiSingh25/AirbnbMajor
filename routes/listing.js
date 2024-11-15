const express = require("express");
const listingRoute = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js");
let { loggedIn, isOwner, validateSchema } = require("../middleware.js")
let ListingController = require("../Controllers/ListingController.js")
const multer = require('multer')
const { storage } = require("../Cloudinary.js");
const Listing = require("../Models/Listing.js");
const upload = multer({ storage });



//index route & create
listingRoute.route("/")
    .get(wrapAsync(ListingController.index))
    .post(loggedIn, upload.single('listing[image]'), validateSchema, wrapAsync(ListingController.createListing))



//new route 
listingRoute.get("/new", loggedIn, wrapAsync(ListingController.newListing));

//display listing according to category


listingRoute.get("/category/:category", async (req, res) => {
    const { category } = req.params;
    let listings = await Listing.find({ category: category }).populate("review");
    listings = listings.map(listing => {
        let totalRating = 0;
        let ratingCount = listing.review.length;

        listing.review.forEach(review => {
            totalRating += review.rating;
        });

        let averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;

        return { ...listing.toObject(), averageRating };
    });
    res.render("./listings/categorizeListings.ejs", { listings, category });
});


// listing update, show, delete
listingRoute.route("/:id")
    .put(loggedIn, isOwner, upload.single('listing[image]'), validateSchema, wrapAsync(ListingController.updateListing))
    .get(wrapAsync(ListingController.showListing))
    .delete(loggedIn, wrapAsync(ListingController.deleteListings))


//edit route
listingRoute.get("/:id/edit", loggedIn, isOwner, wrapAsync(ListingController.editListing))


//host profile


listingRoute.get("/:id/hostProfile", async (req, res) => {
    let _id = req.params.id;
    let data = await Listing.findById(_id).populate({ path: "review", populate: { path: "author" } }).populate("owner")
    if (!data) {
        req.flash("error", "Place not found..!")
        res.redirect("/listings")
    }
    res.render("./listings/hostProfile.ejs", { data })
})




module.exports = listingRoute;