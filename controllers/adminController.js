const Admin = require("../models/Admin");
const Course = require("../models/Course");
const Student = require("../models/Student");
const Feedback = require("../models/Feedback");
const mongoose = require("mongoose")

exports.getAdminDetails = async(req,res) => {
    try {
        const {admin} = req;
        return res.status(200).json({
            status:"success",
            admin
        })
    } catch (error) {
        return res.status(404).json({
            status:"fail",
            message:error
        })
    }
}

exports.createAdmin = async(req,res,next) =>{
    try {
        const newAdmin = await Admin.create(req.body);
        return res.status(201).json({
            status:"success",
            data:{
                newAdmin
            }
        })
    } catch (error) {
        return res.status(404).json({
            status:"fail",
            message:error
        })
    }
}

//transactional
exports.deleteStudent = async(req,res,next) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {student} = req;
        await Feedback.findByIdAndDelete(student._id,{feedbackTo:student._id}).session(session);
        const freshFeedbacks = await Feedback.find();
        //console.log(freshFeedbacks);
        session.commitTransaction();
        return res.status(204).json({
            status:"success",
            data:null
        })
    } catch (error) {
        session.abortTransaction();
        //console.log(error)
        return res.status(404).json({
            status:"fail",
            message:error
        })
    }
}

exports.deleteAdmin = async(req,res) => {
    try {
        const {id} = req.params;
        await Admin.findByIdAndDelete(id);
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

exports.getAllAdmins = async(req,res) => {
    try {
        const allAdmins = await Admin.find();
        res.status(200).json({
            status:"success",
            data:{
                length:allAdmins.length,
                admins:allAdmins
            }
        })
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error
        })
    }
}