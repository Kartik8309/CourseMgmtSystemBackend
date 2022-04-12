const mongoose = require("mongoose")
const validator = require("validator")

const studentSchema = new mongoose.Schema({
    studentName:{
        type:String,
        required:[true,"Please provide a name!"],
    },
    email:{
        type:String,
        required:[true,"Please provide an email!"],
        validate:[validator.isEmail , "Please provide a valid email!"]
    },
    studentPassword:{
        type:String,
        required:[true,"Please provide a password"],
        minlength:[8,"Password must be 8 characters long!"]
    },
    passwordConfirm:{
        type:String,
        required:[true,"Please confirm your password!"],
        validate:{
            validator:function(elem){
                return elem === this.studentPassword
            },
            message:"Passwords do not match!"
        }
    },
    studentContact:{
        type:String,
        minLength:10,
        maxLength:10
    },
    studentAge:{
        type:Number
    },
    studentAddress:{
        type:String
    },
    studentGender:{
        type:String
    },
    enrolledInCourses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }]
})
const Student = mongoose.model("Student",studentSchema);
module.exports = Student;