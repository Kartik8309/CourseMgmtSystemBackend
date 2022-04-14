const Instructor = require("../../models/Instructor");
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
        const newInstructor = await Instructor.create(req.body);
        /* const {studentAge,studentAddress,studentGender} = req.body; role restrictions ?? */
        const token = signToken(newInstructor._id)
        return res.status(201).json({
            status:"success",
            token:token,
            data:{
                newInstructor:newInstructor
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            status:"fail",
            message:error
        })        
    }
}

exports.login = async(req,res,next) => {
    const {email,instructorPassword} = req.body;
    if(!email || !instructorPassword){
        return res.status(400).json({
            status:"fail",
            message:"Please provide a valid email / password!"
        })
    }

    const instructor = await Instructor.findOne({email:email}).select('+instructorPassword');

    if(!instructor || !await instructor.correctPassword(instructorPassword,instructor.instructorPassword)){
        return res.status(401).json({ //401 -> unauthorised
            status:"fail",
            message:"Invalid user / password"
        })
    }

    const token = signToken(instructor._id);
    res.status(200).json({
        status:"success",
        token:token
    })
}

exports.protect = async(req,res,next) => {
    try {
        let token;
        let payload;
        let instructor;
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
            instructor = await Instructor.findById(payload.id)
            if(!instructor){
                throw new Error(); //throw error if user doesn't exists
            }
        } catch (error) {
            return res.status(401).json({
                status:"fail",
                message:"user doesn't exist!"
            })
        }
    
        /* password changes after verification -> model */
        if(instructor.changedPasswordAfter(payload.iat)){
            return res.status(401).json({
                status:"fail",
                message:"Password was changed recently.Log in again!"
            })
        }
        req.instructor = instructor; //storing student to req
        //access to protected route
        next();
    } catch (error) {
        return res.status(404).json({
            status:"fail",
            message:error
        })
    }
}

exports.restrictTo=(...roles) => {
    return (req,res,next) => {
        //roles = ["admin","student"]
        //have access to req.student as protect runs before restrictTo()
        if(!roles.includes(req.instructor.role)){ 
            return res.status(403).json({ //forbidden
                status:"fail",
                message:"You do not have permission to perform this action!"
            })
        } 
        next();
    }
}