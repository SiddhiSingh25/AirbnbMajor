const express = require("express");
const wrapAsync = require("../Utils/wrapAsync.js");
const userRoute = express.Router();

let passport = require("passport");
const { storeUrl, loggedIn } = require("../middlewareBuilt.js");
let UserController = require("../Controllers/UserController.js");
const User = require("../Models/User.js");

const multer = require('multer')
const { storage } = require("../Cloudinary.js");
const Listing = require("../Models/Listing.js");
const upload = multer({ storage });

// Sign Up Routes
userRoute.route("/signUp")
    .get(wrapAsync(UserController.signUp))
    .post(UserController.sendSignUp)


//login Routes
userRoute.route("/logIn")
    .get(UserController.logIn)
    .post(storeUrl, passport.authenticate("local", { failureRedirect: "/user/logIn", failureFlash: true }), UserController.sendLogInData);


//log out
userRoute.get("/logOut", UserController.logOut)


function calculateYearsAgo(createdAt) {
    const currentDate = new Date(); // Current date
    const createdDate = new Date(createdAt); // Parse the createdAt string to a Date object
    const differenceInMilliseconds = currentDate - createdDate; // Difference in milliseconds
    const differenceInYears = differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25); // Convert to years, accounting for leap years
    return Math.floor(differenceInYears); // Round down to the nearest whole number
}


userRoute.get("/dashboard", loggedIn, async (req, res) => {
    let userDetails = await User.findById(req.user._id);
    let id = req.user._id;
    let ownerListings = await Listing.find({ owner: id }).populate("review");
    let postCount = ownerListings.length;
    let reviewCount = 0;
    ownerListings.forEach(listing => {
        listing.review.forEach(review => {
            if (review.author.equals(req.user._id)) {
                reviewCount++;
            }
        });
    });
    let years = calculateYearsAgo(req.user.createdAt);

    
     res.render("./listings/dashboard.ejs", { userDetails, postCount, reviewCount, years})
})



userRoute.get("/dashboard/:id", loggedIn, async (req, res) => {
    let id = req.params.id;
    let userDetails = await User.findById(id);
    res.render("./listings/updateDashboard.ejs", { userDetails })
})

userRoute.post("/dashboard/:id", loggedIn, upload.single('userImage'), async (req, res) => {
    let id = req.params.id;
    console.log(req.file)
    let data = await User.findById(id);
    if (!data) {
        res.flash("error", "User not found!")
    }
    data.details.about = req.body.about;
    data.details.location = req.body.location;
    data.details.language = req.body.language;
    data.details.quote = req.body.quote;
    data.url.instagram = req.body.instagram;
    data.url.linkedin = req.body.linkedin;
    data.url.twitter = req.body.twitter;
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        data.userImage.url = url;
        data.userImage.filename = filename;
    }
    await data.save();
    res.redirect("/user/dashboard/");
})


module.exports = userRoute;