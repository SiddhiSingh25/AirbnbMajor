let mongoose =require("mongoose");
let Schema = mongoose.Schema;
let Review = require("./Reviews")
let User = require("./User.js")
let listingSchema = new Schema({
    title : { type : String},
    description : { type : String},
    image : {
        url :String,
        filename : String
    },
    category : {
        type : String,
        enum: [
            "Homes",
            "Farms",
            "OMG!",
            "Domes",
            "Barns",
            "Caves",
            "Island",
            "Amazing views",
            "Bed & breakfasts",
            "National parks",
            "Lakefront",
            "Amazing pools",
            "Beachfront",
            "Chef kitchen's",
            "Camping",
            "Treehouses",
            "Top of the world",
            "Cabins",
            "Historical homes",
            "Trending",
            "Houseboats"
        ]
    },
    price : {type : Number},
    location: {type : String},
    country : {type : String},
    review : [{type : mongoose.Schema.Types.ObjectId, ref : "Review"}],
    owner : {type : mongoose.Schema.Types.ObjectId, ref : "User"},
    createdAt : {type : Date, default : Date.now()}
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing.review.length){
        await Review.deleteMany({_id : {$in : listing.review}})
    }
})

let Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;