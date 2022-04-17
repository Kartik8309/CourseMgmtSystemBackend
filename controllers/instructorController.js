const Instructor = require("../models/Instructor");
const Course = require("../models/Course")
const mongoose = require("mongoose");
const Feedback = require("../models/Feedback")

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

exports.giveFeedback = async(req,res,next) =>{
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {instructor} = req;
        const {feedbackMessage} = req.body;
        if(feedbackMessage===""){
            return res.status(400).json({
                status:"fail",
                message:"Please enter a valid feedback!"
            })
        }
        const feedbackObj ={
            ...req.body,
            feedBackDate:Date.now(),
            FeedbackTo:req.params.studentId,
            FeedbackBy:instructor._id
        }
        //console.log(typeof(req.params.studentId),typeof(instructor._id) )
        const feedback = await Feedback.create(feedbackObj);
        //await Instructor.findByIdAndUpdate(instructor._id,{$push:{feedBacksGiven:feedback._id}},{new:true}).session(session);
        session.commitTransaction();
        return res.status(200).json({
            status:"success",
            data:{
                feedback
            }
        })

    } catch (error) {
        session.abortTransaction();
        return res.status(404).json({
            message:error
        })
    }
}

exports.deleteFeedback = async(req,res) => {
    try {
        const {instructor} = req;
        const studentId = req.params;
        await Feedback.findOneAndDelete({$and:[{studentId:studentId},{instructorId:instructor._id}]});
        return res.status(204).json({
            success:"true",
            data:null
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            success:"fail",
            message:error
        })
    }
}

/* 

    const {instructor} = req;
    const {feedbackMessage} = req.body;
    if(feedbackMessage===""){
        return res.status(400).json({
            status:"fail",
            message:"Please enter a valid feedback!"
        })
    }
    //console.log(feedbackMessage)
    //make it transaction and add feedbackId to instructor as well as student
    const feedbackObj ={
        ...req.body,
        feedBackDate:Date.now(),
        studentId:req.params.studentId,
        instructorId:instructor._id
    }
    const feedback = await Feedback.create(feedbackObj);
    return res.status(200).json({
        status:"success",
        data:{
            feedback
        }
    })
*/