let mongoose =require("mongoose");
let Schema = mongoose.Schema;
let userDetailsSchema = new Schema({
    desc : {type : String},
    location : {type : String},
    createdAt : {type : Date, default : Date.now()},
    user  : {type : mongoose.Schema.Types.ObjectId, ref : "User"}
});
let UserDetails = mongoose.model("UserDetails", userDetailsSchema);
module.exports = UserDetails;



