const { string, required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    email : {type : String,  required : true},
    details: {
        about : {type : String, default : ""},
        location : {type : String, default : ""},
        language : {type : String, default : ""},
        quote : {type : String, default : ""},
    },
    url : {
        instagram : {type : String, default : ""},
        linkedin : {type : String, default : ""},
        twitter : {type : String, default : ""},
    },
    userImage: {
        url : {type : String},
        filename : {type : String}
    },
    createdAt : {type : Date, default : Date.now()}
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
