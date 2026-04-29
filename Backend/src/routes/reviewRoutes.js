import { Router } from 'express';
import protectMiddleware from '../middlewares/protectMiddleware.js';
import isAuthor from '../middlewares/isAuthor.js';
import { createComment, createReview, deleteReviewById, getAiReview, getAllComments, getAllReviews, getReviewById, updateStatus } from '../controllers/reviewController.js';

const router = Router();

router.post("/", protectMiddleware, createReview);
router.get("/", protectMiddleware, getAllReviews);
router.get("/:id", getReviewById);
router.post("/:id/comments", protectMiddleware, createComment);
router.get("/:id/comments", getAllComments);
router.patch("/:id/status", protectMiddleware, isAuthor, updateStatus);
router.delete("/:id", protectMiddleware, isAuthor, deleteReviewById);
router.post("/:id/aireview", protectMiddleware, isAuthor, getAiReview);


export default router;