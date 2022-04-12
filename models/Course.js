const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseTitle:{
        type:String,
        required:[true,"Please provide a title!"]
    },
    courseDuration:{
        type:String //CAN BE DATE
    },
    courseCode:{
        type:String,
        required:[true,"Please provide a course code"]
    },
    enrolledCandidates:{
        type:Number, //COUNT FROM M:N RELTN TABLE BW STUDENTS AND COURSES
        default:0
    },
    credits:{
        type:Number
    },
    instructorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Instructor"
    },
    enrolledStudents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student"
    }]
})

const Course = mongoose.model("Course",courseSchema);

module.exports = Course;