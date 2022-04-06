const mongoose = require("mongoose");
const validator = require("validator");

/* ADD VALIDATOR VIA PACKAGE FOR EMAIL  */
const adminSchema = new mongoose.Schema({
    adminName:{
        type:String,
        required:[true,"Please provide a name!"]
    },
    adminEmail:{
        type:String,
        required:[true,"Please provide an email!"],
        validate:[validator.isEmail , "Please provide a valid email!"]
    },
    adminPassword:{
        type:String,
        required:[true,"Please provide a password!"]
    },
    adminContact:{
        type:String,
        minlength:9,
        maxlength:9
    },
    adminAddress:{
        type:String  
    }
})

const Admin = mongoose.model("Admin",adminSchema);
module.exports = Admin;