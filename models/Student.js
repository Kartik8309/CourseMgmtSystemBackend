const mongoose = require("mongoose")


/* ADD VALIDATOR VIA PACKAGE FOR EMAIL  */
const studentSchema = new mongoose.Schema({
    studentName:{
        type:String,
        required:[true,"Please provide a name!"],
    },
    studentEmail:{
        type:String,
        required:[true,"Please provide a valid email!"]
    },
    studentPassword:{
        type:String,
        required:[true,"Please provide a password"]
    },
    studentContact:{
        type:String,
        minlength:9,
        maxlength:9
    },
    studentAge:{
        type:Number
    },
    studentAddress:{
        type:String
    },
    studentGender:{
        type:String
    }
})
const Student = mongoose.model("Student",studentSchema);
module.exports = Student;