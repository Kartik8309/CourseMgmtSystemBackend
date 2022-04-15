const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Student = require("../models/Student");
const Course = require("../models/Course");
const {checkId} = require("../utilities/Email/checkStudentEmail")
const {signup, login ,protect,restrictTo} = require("../controllers/Auth/studentAuth")
const {getStudent,getAllStudents,deleteStudent,enrollInCourse,exitFromCourse} = require("../controllers/studentController")


/* using auth/studentAuth */
router.post("/signup",checkId,signup);
router.post("/login",login)


router.get("/:studentId",protect,getStudent)

router.get("/allUsers",getAllStudents)

/* add auth using roles so only student or admin can delete acc of student */
router.delete("/deleteUser/:id",protect,restrictTo("admin","student"),deleteStudent)

/* READ TRANSACTIONS IN MONGODB */
router.patch("/enroll/:courseId",protect,restrictTo("student"),enrollInCourse)

/* Route for isEnrolled too? */

router.patch("/unenroll/:courseId",protect,restrictTo("student"),exitFromCourse)

router.patch("/updateDetails/password",updatePassword);

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

module.exports = router;