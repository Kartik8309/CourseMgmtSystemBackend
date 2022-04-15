const Admin = require("../models/Admin")

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