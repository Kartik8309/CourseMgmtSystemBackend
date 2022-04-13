const Student = require("../../models/Student");
const jwt = require("jsonwebtoken");
const {promisify} = require("util")
require("dotenv")

const signToken = id => {
    return jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}

/* student signup */
exports.signup = async(req,res,next) => {
    try {
        const newStudent = await Student.create(req.body);
        /* const {studentAge,studentAddress,studentGender} = req.body; role restrictions ?? */
        const token = signToken(newStudent._id)
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

exports.login = async(req,res,next) => {
    const {email,studentPassword} = req.body;
    if(!email || !studentPassword){
        return res.status(400).json({
            status:"fail",
            message:"Please provide a valid email / password!"
        })
    }

    const student = await Student.findOne({email:email}).select('+studentPassword');

    if(!student || !await student.correctPassword(studentPassword,student.studentPassword)){
        return res.status(401).json({ //401 -> unauthorised
            status:"fail",
            message:"Invalid user / password"
        })
    }

    const token = signToken(student._id);
    res.status(200).json({
        status:"success",
        token:token
    })
}

exports.protect = async(req,res,next) => {
    try {
        let token;
        let payload;
        let student;
        //console.log(req.headers);
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
            //console.log(token);
            
        }
        
        if(!token){
            return res.status(401).json({ //unauthorised
                status:"fail",
                message:"You are not logged in!"
            })
        }    

        try {
            payload = await promisify(jwt.verify)(token , process.env.JWT_SECRET);
            /* console.log(payload); */
        } catch (error) {
            return res.status(401).json({
                status:"fail",
                message:"Invalid / Expired token!"
            })
        }

        try {
            student = await Student.findById(payload.id)
            if(!student){
                throw new Error(); //throw error if user doesn't exists
            }
        } catch (error) {
            return res.status(401).json({
                status:"fail",
                message:"user doesn't exist!"
            })
        }
    
        /* password changes after verification -> model */
        if(student.changedPasswordAfter(payload.iat)){
            return res.status(401).json({
                status:"fail",
                message:"Password was changed recently.Log in again!"
            })
        }
        req.student = student;
        //access to protected route
        next();
    } catch (error) {
        return res.status(404).json({
            status:"fail",
            message:error
        })
    }
}