const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const {checkId} = require("../utilities/Email/checkAdminEmail")
const {login,signup,protect,restrictTo} = require("../controllers/Auth/adminAuth")
const {getAdminDetails,deleteAdmin,getAllAdmins} = require("../controllers/adminController")

/* DO -> only admin can create another admin */
router.post("/signup",checkId, signup);

router.post("/login",login);

router.get("/:adminId",protect,getAdminDetails);

router.get("/allUsers",getAllAdmins);

router.delete("/deleteUser/:id",protect,restrictTo("admin"),deleteAdmin);

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