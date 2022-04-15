const Instructor = require("../models/Instructor");
const Course = require("../models/Course")
const mongoose = require("mongoose");

exports.checkInstructorExists = async(req,res,next) => {
    try {
        const {id} = req.params;
        const instructor = await Instructor.findById(id);
        if(!instructor){
            throw new Error();
        }
    } catch (error) {
        return res.status(404).json({
            status:"fail",
            message:"Instructor does not exist!"
        })
    }
    next();
}

exports.createCourse = async (req,res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {instructor} = req;
        const createCourseReq = {
            ...req.body,
            instructorId:instructor._id
        }
        const newCourse = await Course.create(createCourseReq);
        await instructor.updateOne({$push:{coursesAssigned:newCourse._id}}).session(session);
        //console.log(instructor);
        await session.commitTransaction();
        return res.status(201).json({
            status:"success",
            data:{
                course:newCourse
            }
        })
    } catch (error) {
        session.abortTransaction();
        res.status(404).json({
            status:"fail",
            message:error
        })
    }
}

exports.getInstructorDetails = async(req,res) => {
    try {
        const {instructor} = req;
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
        //console.log(courses);
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

//need to delete id from course too
//impl transaction delete
//CREATE AGAIN
exports.deleteInstructor = async(req,res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {id} = req.params;
        const courses = await Course.find({instructorId:id}).updateMany({instructorId:null});
        const updatedCourses = await Course.find();
        console.log(updatedCourses);
        //await Instructor.findByIdAndDelete(id).session(session);
        res.status(204).json({
            status:"success",
            data:null
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            status:"fail",
            message:error
        })
    }
}

//need to delete course from instructor too
//impl transaction delete
exports.deleteCourse = async(req,res) => {
    try {
        const {courseId} = req.params;
        await Course.findByIdAndDelete(courseId);
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