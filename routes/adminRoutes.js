const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

router.post("/createAdmin", async (req,res) => {
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

router.get("/allAdmins",async(req,res) => {
    try {
        const allAdmins = await Admin.find();
        res.status(200).json({
            status:"success",
            data:{
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

module.exports = router;