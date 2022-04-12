const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
        minlength:[8,"Password must be 8 characters long!"],
        
    },
    passwordConfirm:{
        type:String,
        required:[true,"Please confirm your password!"],
        //works on SAVE and CREATE
        validate:{ //validate password and confirmPassword fields
            validator:function(elem){
                return elem === this.studentPassword
            },
            message:"Passwords do not match!" //send err message
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

//pre("save") b/w incoming data and persistence to db
studentSchema.pre("save", async function(next){
    if(!this.isModified('studentPassword')){
        return next();
    }
    //only when password changes or created new
    this.studentPassword = await bcrypt.hash(this.studentPassword,12);
    //delete confirm password
    this.passwordConfirm = undefined;
    next();
})

const Student = mongoose.model("Student",studentSchema);
module.exports = Student;