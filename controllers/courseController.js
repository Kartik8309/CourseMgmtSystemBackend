/* const Course = require("../models/Course");

exports.createCourse = async (req,res) => {
    try {
        const newCourse = await Course.create(req.body);
        const {instructor} = req;
        await instructor.updateOne({$push:{coursesAssigned:newCourse._id}}) 
        //console.log(instructor);
        return res.status(201).json({
            status:"success",
            data:{
                course:newCourse
            }
        })
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error
        })
    }
} */