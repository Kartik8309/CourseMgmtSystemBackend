const mongoose = require("mongoose");
const validator = require("validator");

/* ADD VALIDATOR VIA PACKAGE FOR EMAIL  */
const adminSchema = new mongoose.Schema({
    adminName:{
        type:String,
        required:[true,"Please provide a name!"]
    },
    email:{
        type:String,
        required:[true,"Please provide an email!"],
        validate:[validator.isEmail , "Please provide a valid email!"]
    },
    adminPassword:{
        type:String,
        required:[true,"Please provide a password!"]
    },
    passwordConfirm:{
        type:String,
        required:[true,"Please confirm your password!"],
        validate:{
            validator:function(elem){
                return elem === this.adminPassword
            },
            message:"Passwords do not match!"
        }
    },
    adminContact:{
        type:String,
        minLength:10,
        maxLength:10
    },
    adminAddress:{
        type:String  
    }
})

const Admin = mongoose.model("Admin",adminSchema);
module.exports = Admin;