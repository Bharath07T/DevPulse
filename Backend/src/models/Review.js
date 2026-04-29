import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        author : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        code : {
            type : String,
            required : true,
            trim : true
        }, 
        language : {
            type : String,
            required : true,
            trim : true
        },
        status : {
            type : String,
            enum : ["pending", "reviewed"],
            default : "pending"
        },
        isDeleted : {
            type : Boolean,
            default : false
        },
        aiReview : {
            bugs : [
                {
                    lineNo : {
                        type : Number,
                        min : 1
                    },
                    severity : {
                        type : String,
                        enum : ["low", "medium", "high"]
                    },
                    message : {
                        type : String
                    }
                }
            ],
            score : {
                type : Number,
                min : 0,
                max : 100
            },
            suggestions : {
                type : [ String ],
                default : []
            }
        }
    },
    {
        timestamps : true
    }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;