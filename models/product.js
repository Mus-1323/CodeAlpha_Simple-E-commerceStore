const mongoose = require('mongoose');

let ProductSchema=mongoose.Schema({
    title:{
        type:String,
    },
    price:{
        type:Number,
    },
    image:{
        type:String,
    },
    description:{
        type:String,
    },
    category:{
        type:String,
    },


});
module.exports = mongoose.model("Product", ProductSchema);
