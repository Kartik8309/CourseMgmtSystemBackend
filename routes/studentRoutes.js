const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Course = require("../models/Course");
const mongoose = require("mongoose");
const {signup} = require("../controllers/Auth/studentAuth")
/* impl get single student */

const checkId = async(req,res,next) => {
    const {email} = req.body;
    try {
        const data = await Student.find({email:email})
        if(data[0]){
            return res.status(400).json({
                status:"fail",
                message:`Account with Email ${email} already exists!`
            })
        }
    } catch (error) {
        return res.status(500).json({
            status:"fail",
            message:error
        })
    }
    next();
}

/* move functions to controller folder */
/* using auth/studentAuth */
router.post("/signup",checkId,signup);

router.get("/allUsers",async(req,res) => {
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
})

router.delete("/deleteUser/:id",async(req,res) => {
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
})

/* CHECK ROUTE AGAIN */
router.patch("/updateDetails/:id", async(req,res) => {
    try {
        const {id,body} = req.params;
        const updatedDetails = await Student.findByIdAndUpdate(id,body, {
            new:true,
            runValidators:true
        })
        res.status(200).json({
            status:"success",
            data:{
                details:updatedDetails
            }
        })
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error
        })
    }
})

/* READ TRANSACTIONS IN MONGODB */
router.patch("/enroll/:courseId",async(req,res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {courseId} = req.params;
        const {studentId} = req.body;
        const currCourse = await Course.findById(courseId);
        const student = await Student.findByIdAndUpdate(studentId,{$push:{enrolledInCourses:courseId}},{new:true}).session(session);
        session.abortTransaction();
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
})

/* Route for isEnrolled too? */

router.patch("/unenroll/:courseId",async(req,res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {courseId} = req.params;

    } catch (error) {
        
    }
})

module.exports = router;