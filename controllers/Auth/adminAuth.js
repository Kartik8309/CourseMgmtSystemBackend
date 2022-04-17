const Admin = require("../../models/Admin")
const jwt = require("jsonwebtoken");
const {promisify} = require("util")
require("dotenv")

const signToken = id => {
    return jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}


exports.signup = async(req,res,next) => {
    try {
        const newAdmin = await Admin.create(req.body);
        /* const {studentAge,studentAddress,studentGender} = req.body; role restrictions ?? */
        const token = signToken(newAdmin._id)
        return res.status(201).json({
            status:"success",
            token:token,
            data:{
                newAdmin:newAdmin
            }
        })
    } catch (error) {
        //console.log(error)
        return res.status(404).json({
            status:"fail",
            message:error
        })        
    }
}

exports.login = async(req,res,next) => {
    const {email,adminPassword} = req.body;
    if(!email || !adminPassword){
        return res.status(400).json({
            status:"fail",
            message:"Please provide a valid email / password!"
        })
    }

    const admin = await Admin.findOne({adminEmail:email}).select('+adminPassword');
    //console.log(admin);
    if(!admin || !await admin.correctPassword(adminPassword,admin.adminPassword)){
        return res.status(401).json({ //401 -> unauthorised
            status:"fail",
            message:"Invalid user / password"
        })
    }

    const token = signToken(admin._id);
    res.status(200).json({
        status:"success",
        token:token
    })
}

exports.protect = async(req,res,next) => {
    try {
        let token;
        let payload;
        let admin;
        //console.log(req.headers);
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
            console.log(token);
            
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
            admin = await Admin.findById(payload.id)
            //console.log(admin);
            if(!admin){
                throw new Error(); //throw error if user doesn't exists
            }
        } catch (error) {
            return res.status(401).json({
                status:"fail",
                message:"user doesn't exist!"
            })
        }
    
        /* password changes after verification -> model */
        if(admin.changedPasswordAfter(payload.iat)){
            return res.status(401).json({
                status:"fail",
                message:"Password was changed recently.Log in again!"
            })
        }
        req.admin = admin; //storing student to req
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
        //console.log(req);
        //roles = ["admin","student"]
        //have access to req.student as protect runs before restrictTo()
        if(!roles.includes(req.admin.role)){ 
            return res.status(403).json({ //forbidden
                status:"fail",
                message:"You do not have permission to perform this action!"
            })
        } 
        next();
    }
}