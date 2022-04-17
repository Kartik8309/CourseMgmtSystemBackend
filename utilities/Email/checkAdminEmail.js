const Admin = require("../../models/Admin")

exports.checkId = async(req,res,next) => {
    const {adminEmail} = req.body;
    console.log(adminEmail)
    try {
        const data = await Admin.findOne({adminEmail:adminEmail})
        console.log(data)
        if(data){
            return res.status(400).json({
                status:"fail",
                message:`Account with Email ${adminEmail} already exists!`
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status:"fail",
            message:error
        })
    }
    next();
}