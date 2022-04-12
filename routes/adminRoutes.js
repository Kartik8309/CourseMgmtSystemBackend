const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

/* move functions to controller folder */
const checkId = async(req,res,next) => {
    const {email} = req.body;
    try {
        const data = await Admin.find({email:email})
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

router.post("/createUser",checkId, async (req,res) => {
    //add middle to check for roleType
    try {
        const newAdmin = await Admin.create(req.body);
        res.status(201).json({
            status:"success",
            data:{
                admin:newAdmin
            }
        })
    } catch (error) {
        res.status(400).json({
            status:"fail",
            message:error
        })
    }
})

router.get("/allUsers",async(req,res) => {
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
})

router.delete("/deleteUser/:id",async(req,res) => {
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
})

/* CHECK ROUTE AGAIN */
router.patch("/updateDetails/:id", async(req,res) => {
    try {
        const {id,body} = req.params;
        const updatedDetails = await Admin.findByIdAndUpdate(id,body, {
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