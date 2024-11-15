let mongoose =require("mongoose");
let Schema = mongoose.Schema;
let reviewSchema = new Schema({
    rating : {type : Number, min :1, max :5, default : 3},
    comment : {type : String},
    createdAt : {type : Date, default : Date.now()},
    author  : {type : mongoose.Schema.Types.ObjectId, ref : "User"}
});
let Review = mongoose.model("Review", reviewSchema);
module.exports = Review;