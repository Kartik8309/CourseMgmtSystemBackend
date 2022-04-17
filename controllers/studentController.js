const mongoose = require("mongoose")
const Student = require("../models/Student")
const Course = require("../models/Course");
const jwt = require("jsonwebtoken");
const multer = require("multer")

const multerStorage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'public/img/students');
    },
    filename:(req,file,cb) =>{
        //user-id-timestamp.extension
    }
})

const upload = multer({dest:'public/img/students'}) //w/o options will be in memory only
//creates middleware fn

const signToken = id => {
    return jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}

const filterObject = (obj,...allowedFields) => {
    let newObject = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)){
            newObject[el] = obj[el] //add desired fields to new obj
        }
    })
    return newObject;
}

exports.uploadUserPhoto = upload.single('photo');
//upload middle will put the file in dest and put some info about it on req obj and call next()


exports.getStudent = async(req,res,next) => {
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
        await Student.findByIdAndUpdate(req.student._id,{active:false});
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

exports.updatePassword = async(req,res,next) => {
    //get user from collection
    //if currently entered password correct,update to new password
    //log user in with JWT
    try {
        const {currentPassword,newPassword,newPasswordConfirm} = req.body;
        const student = await Student.findById(req.student._id).select('+studentPassword');
        if(!await student.correctPassword(currentPassword,student.studentPassword)){
            return res.status(401).json({
                status:"fail",
                message:"Current Password is incorrect!"
            })
        }
        student.studentPassword = newPassword;
        student.passwordConfirm = newPasswordConfirm;
        await student.save(); //runs validation again
        const token = signToken(student._id);
        return res.status(200).json({
            status:"success",
            token:token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status:"fail",
            message:error
        })
    }
    //didn't do findByIdAndUpdate as validation will not work with it
    //works only on create and save(); 
}

/* allowed to admin only?? */
exports.updateDetails = async(req,res) => {
    console.log(req.file);
    console.log(req.body);
    //error if password updation tried
    //else update user document
    if(req.body.currentPassword || req.body.passwordConfirm){
        return res.status(400).json({ //400 -> bad request
            status:"fail",
            message:"Please use /updateDetails/password for password updates!"
        })
    }
    try {
        //can't use user.save() as some fields are required which throws err
        //using findByIdAndUpdate() here
        const filteredBody = filterObject(req.body,'studentName','studentEmail');
        const updatedStudent = await Student.findByIdAndUpdate(req.student._id,filteredBody,{new:true,runValidators:true});
        return res.status(200).json({
            status:"success",
            data:{
                updatedStudent
            }
        })
    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
}

/* 
    , async(req,res) => {
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
}
*/

/* check whether isEnrolled first or not */
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