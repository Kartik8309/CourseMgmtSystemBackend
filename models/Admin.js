const mongoose = require("mongoose");

/* ADD VALIDATOR VIA PACKAGE FOR EMAIL  */
const adminSchema = new mongoose.Schema({
    adminName:{
        type:String,
        required:[true,"Please provide a name!"]
    },
    adminEmail:{
        type:String,
        required:[true,"Please provide a valid mail!"]
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