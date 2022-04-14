const Instructor = require("../models/Instructor");
const Course = require("../models/Course")
exports.deleteInstructor = async(req,res) => {
    try {
        const {id} = req.params;
        await Instructor.findByIdAndDelete(id);
        res.status(204).json({
            status:"success",
            data:null
        })
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error
        })
    }
}

exports.getInstructorDetails = async(req,res) => {
    try {
        const {instructorId} = req.params;
        const instructor = await Instructor.findById(instructorId);
        return res.status(200).json({
            status:"success",
            instructor
        })
    } catch (error) {
        return res.status(404).json({
            status:"fail",
            message:error
        })
    }
}

exports.getAllInstructors = async(req,res) => {
    try {
        const allInstructors = await Instructor.find();
        res.status(200).json({
            status:"success",
            data:{
                admins:allInstructors
            }
        })
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error
        })
    }
}

exports.getInstructorCourses = async(req,res) => {
    try {
        const {id} = req.params;
        const courses = await Course.find({instructorId:id})
        console.log(courses);
        res.status(200).json({
            status:"success",
            data:{
                length:courses.length,
                courses:courses
            }
        })
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error
        })
    }
}