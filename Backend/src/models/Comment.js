import mongoose from "mongoose";

const commentReview = new mongoose.Schema(
    {
        reviewId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review",
            required : true
        },
        author : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        authorName : {
            type : String,
            required : true,
            trim : true
        },
        text : {
            type : String,
            required : true,
            trim : true
        },
        lineNumber : {
            type : Number,
            required : true,
            min : 1
        }
    },
    {
        timestamps : true
    }
);

const Comment = mongoose.model("Comment", commentReview);
export default Comment;