const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");

/* const checkInstructorId = async(req,res,next) => {
    try {
        const {instructorId} = req.body;
        const instructor = await Instructor.findById(instructorId);
        req.instructor = instructor;
    } catch (error) {
        error.message = "Cannot create course without valid instructor!"
        return res.status(404).json({
            success:"fail",
            message:error
        })
    }
    next();
} */

/* router.post("/createCourse",protect,restrictTo("instructor"), ) */ //Inside instructorController

router.get("/allCourses",async(req,res) => {
    try {
        const allCourses = await Course.find();
        res.status(200).json({
            status:"success",
            data:{
                length:allCourses.length,
                courses:allCourses
            }
        })
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error
        })
    }
})

router.get("/:id/getInstructor",async(req,res) => {
    try {
        const {id} = req.params;
        const course = await Course.findOne({_id:id}).populate("instructorId");
        res.status(200).json({
            status:"success",
            data:{
                instructor:course.instructorId
            }
        })
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error
        })
    }
})

/* router.delete("/deleteCourse/:id",async(req,res) => {
    try {
        const {id} = req.params;
        await Course.findByIdAndDelete(id);
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
}) */

/* CHECK ROUTE AGAIN */
router.patch("/updateDetails/:id", async(req,res) => {
    try {
        const {id,body} = req.params;
        const updatedDetails = await Course.findByIdAndUpdate(id,body, {
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

module.exports = router;