let express= require("express")
let app = express()
let mongoose = require("mongoose");
let port = 8080;
let ExpressError = require("./ExpressError")
let init = require("../init/data");
const Listing = require("../Models/Listing");

let Mongo_Url = "mongodb://localhost:27017/Wanderlust";

main()

.then(()=>{
    console.log("Connected to database")
})
.catch((err)=>{
    console.log(err)
})

async function main() {
    mongoose.connect(Mongo_Url)
}

// send data to database
const initDb = async(req,res)=>{
    await Listing.deleteMany()
    init.data = init.data.map((obj)=>({...obj, owner: "6731a3318936e22d437b1444", createdAt : Date.now() } ))
    await Listing.insertMany(init.data)
    console.log("Data send sucesssfully")
}
initDb();


// app.use((req, res, next)=>{
//     let {queryData} = req.query;
//     console.log(queryData)
//     console.log("Middleware")
//     next()
// })
// app.use("/new", (req,res, next)=>{
//     let {token} = req.query;
//     if(token == "11"){
//         res.send("mATCHED")
//     }
//     else{
//         res.send("Not allowed")
//     }
// })
// let checkToken = (req,res,next)=>{
//     let {token} = req.query;
//     if(token == "11"){
//         res.send("mATCHED")
//     }
//     else{
//         res.send("Not allowed")
//     }
// }
// app.get("/new", checkToken, (req,res)=>{
//     res.send("Middleware")
// })
// app.use((req, res, next)=>{
//     let time =  new Date(Date.now()).toLocaleString();
//     console.log(req.hostname, req.params, req.path, time)
//     next()
// })
// app.get("/check", (req,res)=>{
//     res.send("Check route")
// })

// app.get("/randomRoute", ()=>{
//     res.send("Random")
// })

// app.use((req,res, next)=>{
//     console.log("Middlewarwe 1")
//     next()
// })
// app.get("/new", (req,res)=>{
//     throw new ExpressError(401, "Acess not")
// })
// app.get("/neww", (req,res)=>{
//     throw new ExpressError(444, "No")
// })
// app.use((err, req,res,next)=>{
//     console.log(err, "error1")
//     next(err)
// })

// app.use((err, req,res,next)=>{
//     let {status=500, msg="Something went wrong"} = err;
//     res.status(status).send(msg)
//     next(err)
// })
// app.get("/admin", (req,res)=>{
//     throw new ExpressError(400, "njjs");
// })
// app.use((err, req, res, next)=>{
//     console.log(err)
//     let {status, message} = err;
//     res.status(status).send(message)
// }) 
app.get("/data", async(req,res)=>{
     let data = await Listing.find()
     if(data){
        throw new ExpressError(401, "error")
     }
    //  res.send(data)
    
})

app.get("/data/:id", async(req,res)=>{
    let _id = req.params.id;
    let result = await Listing.findById(_id)
    // if(!result){
    //     throw new Error("error")
    // }
    // if(result == ""){
    //     throw new Error("error")
    // }
    res.send(result)
    console.log(result)
})

app.use((err, req, res, next)=>{
    let {status=500, message = 'error'}= err;
    res.status(status).send(message)
})
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
})