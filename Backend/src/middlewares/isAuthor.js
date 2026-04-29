import Review from '../models/Review.js';

const isAuthor = async (req, res, next) => {
    try{
        const reviewId = req.params.id;
        const review = await Review.findById( reviewId );

        if(!review){
            const error = new Error("A Review with requested id never exists");
            error.statusCode = 404;
            return next(error);
        }

        if(review.author.toString() === req.user._id.toString()){
            next();
        }else{
            const error = new Error("Unauthorized Access");
            error.statusCode = 403;
            next(error);
        }
    }catch(error){
        error.statusCode = 500;
        next(error);
    }
}

export default isAuthor;