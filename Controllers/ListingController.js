const Listing = require('../Models/Listing');
const { listingSchema, reviewSchema } = require("../schema.js")
const ExpressError = require('../Utils/ExpressError.js');


//Index Controller
module.exports.index = async (req, res) => {
    let data = await Listing.find().populate("review");

    // Calc the avg rating
    data = data.map(listing => {
        let totalRating = 0;
        let ratingCount = listing.review.length;

        listing.review.forEach(review => {
            totalRating += review.rating;
        });

        let averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;

        return { ...listing.toObject(), averageRating };
    });

    res.render("listings/index", { data });
};


//NewListing Controller
module.exports.newListing = async (req, res) => {
    res.render("./listings/new.ejs");
}

//createListing Controller
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = req.body.listing;
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    let data = new Listing(newListing)
    await data.save();
    req.flash("success", "Successfully Registered!")
    res.redirect("/listings")
}

//editListing Controller
module.exports.editListing = async (req, res) => {
    let _id = req.params.id;
    let data = await Listing.findById(_id);
    if (!data) {
        req.flash("error", "Place not found..!")
        res.redirect("/listings")
    }
    let orignalUrl = data.image.url.replace("/upload", "/upload/w_250");
    res.render("./listings/update.ejs", { data, orignalUrl })
}

//updateListing Controller
module.exports.updateListing = async (req, res) => {
    let _id = req.params.id;
    let data = await Listing.findByIdAndUpdate(_id, { ...req.body.listing });
    if (typeof (req.file) !== undefined) {
        let url = req.file.path;
        let filename = req.file.filename;
        data.image = { url, filename };
        data.save()
    }
    req.flash("success", "Listing updated..!")
    res.redirect(`/listings/${_id}`)
}

function calculateDaysAgo(createdAt) {
    const currentDate = new Date(); // Current date
    const differenceInMilliseconds = currentDate - createdAt; // Difference in milliseconds
    return Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days
}

function calculateYearsAgo(createdAt) {
    const currentDate = new Date(); // Current date
    const createdDate = new Date(createdAt); // Parse the createdAt string to a Date object
    const differenceInMilliseconds = currentDate - createdDate; // Difference in milliseconds
    const differenceInYears = differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25); // Convert to years, accounting for leap years
    return Math.floor(differenceInYears); // Round down to the nearest whole number
}



//showListing Controller
module.exports.showListing = async (req, res) => {
    let _id = req.params.id;
    let count = await Listing.findById(_id).populate("review");
    let data = await Listing.findById(_id).populate({ path: "review", populate: { path: "author" } }).populate("owner");
    if (!data) {
        req.flash("error", "Place not found..!")
        res.redirect("/listings")
    }
    data.review.forEach((item) => {
        item.daysAgo = calculateDaysAgo(new Date(item.createdAt));
    });
    data.PresentSince = calculateYearsAgo(new Date(data.createdAt));
    let holdValue = data.PresentSince < 1 ? "Less than 1 year" : `${data.PresentSince} years`;
    res.render("./listings/card.ejs", { data, holdValue })
}

//deleteListings Controller
module.exports.deleteListings = async (req, res) => {
    let _id = req.params.id;
    let data = await Listing.findByIdAndDelete(_id);
    if (!data) {
        req.flash("error", "Not Found!")
    }
    else {
        req.flash("success", "Sucessfully deleted...!")
    }
    res.redirect("/listings")
}
