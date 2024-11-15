let express= require("express")
let app = express()
let mongoose = require("mongoose");
let port = 8888;
let cookieParser = require("cookie-parser")
let session = require("express-session")
let flash = require("connect-flash")
let path = require("path")
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

let sessionOpt = {
    secret : "secretcode",
    resave : false,
    saveUninitialized : true
}

app.use(session(sessionOpt))
app.use(cookieParser("code"))
app.use(flash())

//store data in cookie
app.get("/data", (req,res)=>{
    res.cookie("name", "Siddhi")
    res.cookie("password", "123", {signed : true})
    res.send("Login by user")
})

//get data 
app.get("/userView", (req,res)=>{
    let {name} = req.cookies;
    let password = req.signedCookies.password;
    res.send(`Hii, ${name} and your password is : ${password}`)
})


app.get("/expressSession", (req, res)=>{
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count = 1;
    }
    res.send(`sESSION COUNT IS : ${req.session.count}`)
})

app.get("/register", (req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name =  name;
    if(req.session.count){
        req.session.count++
    }
    else{
        req.session.count=1
    }
    req.flash("success", "Registed Sucessfully!!")
    // res.send(`Heyy Register done! ${name}`);
    res.redirect("/hello")

})

app.get("/hello", (req,res)=>{
    res.locals.msg = req.flash("success")
    res.render("msg.ejs", {name :  req.session.name, count : req.session.count})
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})