import Review from "../models/Review.js";
import Comment from "../models/Comment.js";
import generateAiReview from "../utils/generateAiReview.js";
import { getIO } from "../socket.js";

export const createReview = async (req, res, next) => {
    const author = req.user._id;
    const { code, language } = req.body;

    try{
        const newReview = new Review({
            author,
            code,
            language
        });

        const savedReview = await newReview.save();

        res.status(201).json({
            _id : savedReview.id,
            code : savedReview.code,
            language : savedReview.language
        });

    }catch(error){
        error.statusCode = 500;
        next(error);
    }
}

export const getAllReviews = async (req, res, next) => {
    const userId = req.user._id;

    try{
        const allReviews = await Review.find({ 
            author : userId,
            isDeleted : false
         });

        res.status(200).json(allReviews);

    }catch(error){
        error.statusCode = 500;
        next(error);
    }
}

export const getReviewById = async (req, res, next) => {
    const reviewId = req.params.id;

    try{
        const review = await Review.findById(reviewId).populate("author", "username email");

        if(!review || review.isDeleted === true){
            const error = new Error("Review not found");
            error.statusCode = 404;
            return next(error);
        }

        res.status(200).json(review)

    }catch(error){
        error.statusCode = 500;
        next(error);
    }
}

export const createComment = async (req, res, next) => {
    const reviewId = req.params.id;
    const author = req.user._id;
    const authorName = req.user.username;
    const { text, lineNumber } = req.body;

    try{
        const newComment = new Comment({
            reviewId,
            author,
            authorName,
            text,
            lineNumber
        });

        const savedComment = await newComment.save();

        res.status(201).json({
            _id : savedComment.id,
            authorName : savedComment.authorName,
            text : savedComment.text,
            lineNumber : savedComment.lineNumber
        });

    }catch(error){
        error.statusCode = 500;
        next(error);
    }
}

export const getAllComments = async (req, res, next) => {
    const reviewId = req.params.id;

    try{
        const comments = await Comment.find({ reviewId });

        // if(comments.length === 0){
        //     const error = new Error("No Comments found for this review");
        //     error.statusCode = 404;
        //     return next(error);
        // }

        res.status(200).json(comments);

    }catch(error){
        error.statusCode = 500;
        next(error);
    }
}

export const updateStatus = async (req, res, next) => {
    const reviewId = req.params.id;
    const { status } = req.body;

    try{
        if(!["pending", "reviewed"].includes(status)){
            const error = new Error("Invalid status value");
            error.statusCode = 400;
            return next(error);
        }

        const review = await Review.findByIdAndUpdate(
            reviewId,
            { status },
            { new : true }
        );

        if(!review){
            const error = new Error("Route not found");
            error.statusCode = 404;
            return next(error);
        }

        const io = getIO();
        io.to(reviewId).emit("review-ended", { reviewId });

        res.status(200).json(review);

    }catch(error){
        error.statusCode = 500;
        next(error);
    }
}

export const deleteReviewById = async (req, res, next) => {
    const reviewId = req.params.id;

    try{
        const review = await Review.findById(reviewId);

        if(!review){
            const error = new Error("Review not found");
            error.statusCode = 404;
            return next(error);
        }

        const deletedReview = await Review.findByIdAndUpdate(
            reviewId,
            { isDeleted : true },
            { returnDocument: 'after' }
        );

        if(!deletedReview){
            const error = new Error("Review not found");
            error.statusCode = 404;
            return next(error);
        }

        res.status(200).json({ message : "Review deleted successfully" });
    }catch(error){
        error.statusCode = 500;
        next(error);
    }
}

export const getAiReview = async (req, res,  next) => {
    const reviewId = req.params.id;

    try{
        const review = await Review.findById(reviewId);

        if(!review){
            const error = new Error("Review not found");
            error.statusCode = 404;
            return next(error);
        }

        if(review.aiReview && review.aiReview.score !== undefined){
            return res.status(200).json(review);
        }

        const aiResult = await generateAiReview(review);

        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { aiReview : aiResult },
            { new : true }
        ).populate("author", "username email");;

        const io = getIO();
        io.to(reviewId).emit("ai-review-done", aiResult);

        res.status(200).json(updatedReview);

    }catch(error){
        error.statusCode = error.statusCode || 500;
        next(error);
    }
}