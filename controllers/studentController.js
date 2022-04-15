const mongoose = require("mongoose")
const Student = require("../models/Student")
const Course = require("../models/Course")

exports.getStudent = async(req,res) => {
    try {
        const {student} = req;
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

/* remove from courses as well */
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
}/* check whether isEnrolled first or not */
exports.enrollInCourse = async(req,res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {courseId} = req.params;
        const {student} = req;
        const currCourse = await Course.findById(courseId);
        const updatedStudent = await Student.findByIdAndUpdate(student._id,{$push:{enrolledInCourses:courseId}},{new:true}).session(session);
        //session.abortTransaction();
        const course = await Course.findByIdAndUpdate(courseId,{$push:{enrolledStudents:student._id},enrolledCandidates:currCourse.enrolledCandidates+1},{new:true}).session(session);
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

/* check whether is enrolled or not first */
exports.exitFromCourse = async(req,res) => {
    const session = await mongoose.startSession();
    const {student} = req;
    const {courseId} = req.params;
    try {
        session.startTransaction();
        const currCourse = await Course.findById(courseId);
        await Student.findByIdAndUpdate(student._id,{$pull:{enrolledInCourses:courseId}},{new:true}).session(session);
        const course = await Course.findByIdAndUpdate(courseId,{$pull:{enrolledStudents:student._id},enrolledCandidates:currCourse.enrolledCandidates-1},{new:true}).session(session);
        session.commitTransaction();
        res.status(200).json({
            status:"success",
            data:course
        })
    } catch (error) {
        console.log(error)
        session.abortTransaction();
        res.status(500).json({
            status:"fail",
            message:error
        })
    }

}