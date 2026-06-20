const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose").default;

let UserSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
   
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);

