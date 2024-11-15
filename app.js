if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}



let express = require('express');
let app = express();
let mongoose = require("mongoose");
let port = 8080;
let path = require("path");
let methodOverride = require("method-override");
let ejsMate = require("ejs-mate");
const ExpressError = require('./Utils/ExpressError.js');
const session = require("express-session");
const MongoStore = require('connect-mongo');
let flash = require("connect-flash");
let passport = require("passport")
let LocalStrategy = require("passport-local");
let User = require("./Models/User.js");




const listingRoute = require("./routes/listing.js")
const reviewRoute = require("./routes/reviews.js")
let userRoute = require("./routes/user.js")

const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto : {
        secret: process.env.SECRET
    },
    touchAfter : 24 * 3600
  })

  store.on("error", (error) => {
    console.log("Got error in mongo session store:", error);
});



let sessionOpt = {
    store : store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}



main()
    .then(() => {
        console.log("Connected to Database")
    })
    .catch((err) => {
        console.log(err)
    })


async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}


// async function main() {
//     await mongoose.connect("mongodb://localhost:27017/Wanderlust");
// }


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

app.use(session(sessionOpt))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next();
})


// app.use((req, res, next) => {
//     if (req.isAuthenticated()) {
//         res.locals.currUser = req.user;  
//     } else {
//         res.locals.currUser = null;  
//     }
//     next();
// });

 app.get("/",(req,res)=>{
    res.render("/listings/hero.ejs")
 })
app.use("/listings", listingRoute)
app.use("/listings/:id/reviews", reviewRoute);
app.use("/user", userRoute);


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    res.render("./listings/error.ejs", { err })
});
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Sometg went wrong';
    res.status(statusCode).render('./listings/error.ejs', { err });
});
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'An unexpected error occurred' } = err;
    res.status(statusCode).render('./listings/error.ejs', { err: { name: err.name || 'Error', message } });
});

app.listen(port, async () => {
    console.log(`Server is running on port ${port}.`)
})
