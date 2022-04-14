const mongoose = require("mongoose")
const Student = require("../models/Student")
const Course = require("../models/Course")

exports.getStudent = async(req,res) => {
    try {
        const {studentId} = req.params;
        const student = await Student.findById(studentId);
        return res.status(200).json({
            status:"success",
            student
        })
    } catch (error) {
        return res.status(404).json({
            status:"fail",
            message:error
        })
    }
}

exports.getAllStudents = async(req,res) => {
    try {
        const allStudents = await Student.find();
        res.status(200).json({
            status:"success",
            data:{
                length:allStudents.length,
                admins:allStudents
            }
        })
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error
        })
    }
}

exports.deleteStudent = async(req,res) => {
    try {
        const {id} = req.params;
        await Student.findByIdAndDelete(id);
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

exports.enrollInCourse = async(req,res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {courseId} = req.params;
        const {studentId} = req.body;
        const currCourse = await Course.findById(courseId);
        const student = await Student.findByIdAndUpdate(studentId,{$push:{enrolledInCourses:courseId}},{new:true}).session(session);
        //session.abortTransaction();
        const course = await Course.findByIdAndUpdate(courseId,{$push:{enrolledStudents:studentId},enrolledCandidates:currCourse.enrolledCandidates+1},{new:true}).session(session);
        await session.commitTransaction();
        res.status(201).json({
            status:"success",
            data:course
        })
    }
    catch(error){
        await session.abortTransaction();
        res.status(404).json({
            status:"fail",
            message:error
        })
    }  
}