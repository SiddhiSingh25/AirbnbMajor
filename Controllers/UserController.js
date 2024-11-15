let User = require("../Models/User.js")


//signUp controller
module.exports.signUp = async (req, res) => {
    res.render("./listings/signUp.ejs");
}

//sendSignUp controller
module.exports.sendSignUp = async (req, res) => {
    try {
        let details = req.body.details;
        let newUser = new User({
            username: details.username,
            email: details.email
        });
        let result = await User.register(newUser, details.password)

        req.login(result, (err) => {
            if (err) return next(err);  // Pass the error to the error-handling middleware if it occurs
            req.flash("success", "Registered Successfully!");
            return res.redirect("/listings");  // Redirect to listings after successful login
        });
    }
    catch (err) {
        req.flash("error", err.message)
        res.redirect("/user/signUp")
    }
}



//logIn Controller
module.exports.logIn = (req, res) => {
    res.render("./listings/logIn.ejs")
}


//sendLogInData Controller
module.exports.sendLogInData = async (req, res) => {
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect( redirectUrl);
}

//logOut Controller

module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {
        return next(err)
    })
    req.flash("success", "You are log out!")
    res.redirect("/listings")
}