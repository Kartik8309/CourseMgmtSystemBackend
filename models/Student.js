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
    role:{
        type:String,
        enum:['student','admin','instructor'], //allow certain roles only
        default:"student"
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
    passwordChangedAt: {
        type:Date
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

//instance methods available to all docs of current model
studentSchema.methods.correctPassword = async function(reqPassword,userPassword) {
    return await bcrypt.compare(reqPassword,userPassword);
}

studentSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = +this.passwordChangedAt.getTime()/1000; //change to seconds format
        return JWTTimestamp < changedTimeStamp; //100<200
        //console.log(changedTimeStamp, JWTTimestamp);
    }
    return false;//means password never changed
}



const Student = mongoose.model("Student",studentSchema);
module.exports = Student;