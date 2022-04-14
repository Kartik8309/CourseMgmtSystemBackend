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
    role:{
        type:String,
        default:"admin"
    },
    adminPassword:{
        type:String,
        required:[true,"Please provide a password!"],

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
    passwordChangedAt: {
        type:Date
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

//saving hash password
adminSchema.pre("save", async function(next){
    if(!this.isModified('adminPassword')){
        return next();
    }
    //only when password changes or created new
    this.adminPassword = await bcrypt.hash(this.adminPassword,12);
    //delete confirm password
    this.passwordConfirm = undefined;
    next();
})

//instance methods available to all docs of current model
adminSchema.methods.correctPassword = async function(reqPassword,userPassword) {
    return await bcrypt.compare(reqPassword,userPassword);
}

adminSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = +this.passwordChangedAt.getTime()/1000; //change to seconds format
        return JWTTimestamp < changedTimeStamp; //100<200
        //console.log(changedTimeStamp, JWTTimestamp);
    }
    return false;//means password never changed
}

const Admin = mongoose.model("Admin",adminSchema);
module.exports = Admin;