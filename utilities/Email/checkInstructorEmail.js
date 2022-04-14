const Instructor = require("../../models/Instructor")

exports.checkId = async(req,res,next) => {
    const {email} = req.body;
    try {
        const data = await Instructor.find({email:email})
        if(data[0]){
            return res.status(400).json({
                status:"fail",
                message:`Account with Email ${email} already exists!`
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