const mongoose = require("mongoose");
const validator = require("validator")

/* ADD INSTR TO COURSES ONE TO MANY MAPPING */
const instructorSchema = new mongoose.Schema({
    email:{
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
    passwordConfirm:{
        type:String,
        required:[true,"Please confirm your password!"],
        validate:{
            validator:function(elem){
                return elem === this.instructorPassword
            },
            message:"Passwords do not match!"
        }
    },
    instructorContact:{
        type:String,
        minLength:10,
        maxLength:10
    },
    instructorAddress:{
        type:String
    },
    /* instructorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }, */
    coursesAssigned:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
        }
    ]

})

const Instructor = mongoose.model("Instructor",instructorSchema);
module.exports = Instructor;