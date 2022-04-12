const Student = require("../../models/Student");

/* student signup contr */
exports.signup = async(req,res,next) => {
    try {
        const newStudent = await Student.create(req.body);
        /* const {studentAge,studentAddress,studentGender} = req.body; role restrictions ?? */
        
        return res.status(201).json({
            status:"success",
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