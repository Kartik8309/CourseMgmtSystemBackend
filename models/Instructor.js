const mongoose = require("mongoose");
const validator = require("validator")

/* ADD INSTR TO COURSES ONE TO MANY MAPPING */
const instructorSchema = new mongoose.Schema({
    instructorEmail:{
        type:String,
        required:[true,"Please provide an email!"],
        validate:[validator.isEmail , "Please provide a valid email!"]
    },
    instructorName:{
        type:String,
        required:[true,"Please provide a name!"]
    },
    instructorPassword:{
        type:String,
        required:[true,"Please provide a password!"]
    },
    instructorContact:{
        type:String,
        minlength:9,
        maxlength:9
    },
    instructorAddress:{
        type:String
    }

})

const Instructor = mongoose.model("Instructor",instructorSchema);
module.exports = Instructor;