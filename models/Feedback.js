const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    feedbackMessage:{
        type:String,
        required:[true,"Please provide a valid feedback!"],
        maxlength:120
    },
    feedBackDate:{
        type:Date
    },
    FeedbackTo:{
        type:String
    },
    FeedbackBy:{
        type:String
    }
})

const Feedback = mongoose.model("Feedback",feedbackSchema);
module.exports = Feedback;