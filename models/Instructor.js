const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcryptjs");

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
    role:{
        type:String,
        enum:['student','admin','instructor'], //allow certain roles only
        default:"instructor"
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
    passwordChangedAt: {
        type:Date
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
//saving hash password
instructorSchema.pre("save", async function(next){
    if(!this.isModified('instructorPassword')){
        return next();
    }
    //only when password changes or created new
    this.instructorPassword = await bcrypt.hash(this.instructorPassword,12);
    //delete confirm password
    this.passwordConfirm = undefined;
    next();
})

//instance methods available to all docs of current model
instructorSchema.methods.correctPassword = async function(reqPassword,userPassword) {
    return await bcrypt.compare(reqPassword,userPassword);
}

instructorSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = +this.passwordChangedAt.getTime()/1000; //change to seconds format
        return JWTTimestamp < changedTimeStamp; //100<200
        //console.log(changedTimeStamp, JWTTimestamp);
    }
    return false;//means password never changed
}

const Instructor = mongoose.model("Instructor",instructorSchema);
module.exports = Instructor;