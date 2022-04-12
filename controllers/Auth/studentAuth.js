const Student = require("../../models/Student");
const jwt = require("jsonwebtoken");
require("dotenv")
/* student signup contr */
exports.signup = async(req,res,next) => {
    try {
        const newStudent = await Student.create(req.body);
        /* const {studentAge,studentAddress,studentGender} = req.body; role restrictions ?? */
        const token = jwt.sign({id:newStudent._id},process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRES_IN
        })
        return res.status(201).json({
            status:"success",
            token:token,
            data:{
                student:newStudent
            }
        })
    } catch (error) {
        return res.status(404).json({
            status:"fail",
            message:error
        })        
    }
}