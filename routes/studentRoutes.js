const express = require("express");
const multer = require("multer")
const router = express.Router();
const {checkId} = require("../utilities/Email/checkStudentEmail")
const {signup, login ,protect,restrictTo} = require("../controllers/Auth/studentAuth")
const {getStudent,getAllStudents,enrollInCourse,exitFromCourse,updatePassword,updateDetails,uploadUserPhoto} = require("../controllers/studentController")
const {deleteStudent} = require("../controllers/adminController")

/* using auth/studentAuth */
router.post("/signup",checkId,signup);
router.post("/login",login)

router.get("/allUsers",getAllStudents)


router.get("/:studentId",protect,getStudent)

/* add auth using roles so only admin can delete acc of student */
/* need to check active on login always */
router.delete("/deleteUser",protect,restrictTo("admin"),deleteStudent)

/* READ TRANSACTIONS IN MONGODB */
router.patch("/enroll/:courseId",protect,restrictTo("student"),enrollInCourse)

/* Route for isEnrolled too? */

router.patch("/unenroll/:courseId",protect,restrictTo("student"),exitFromCourse)

router.patch("/updateDetails/password",protect,restrictTo("student"), updatePassword);

/* should be admin only?? */
//check again
router.patch("/updateDetails",protect,restrictTo("student"),updateDetails)



module.exports = router;