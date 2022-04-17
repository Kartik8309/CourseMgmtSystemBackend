const Feedback = require("../../models/Feedback")

exports.checkFeedbackGiven = async(req,res,next) => {
    try {
        const {instructor} = req;
        const {studentId} = req.params;
        //console.log(instructor._id)
        const isFeedbackGiven = await Feedback.findOne({$and:[{studentId:studentId},{instructorId:instructor._id}]});
        //console.log(isFeedbackGiven)
        if(isFeedbackGiven){
            return res.status(400).json({
                status:"fail",
                message:"Feedback can be given only once!"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:"fail",
            message:error
        })
    }
    next();
}