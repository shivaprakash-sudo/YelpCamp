// import necessary modules
import express from "express";
import { validateReview, isLoggedIn, isReviewAuthor } from '../middleware.js';
import { createReview, deleteReview } from "../controllers/reviews.js";

// create express router with params merged
const router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn, validateReview, createReview);


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, deleteReview);

export default router;