// import necessary modules
import express from "express";
import Review from "../models/review.js";
import Campground from "../models/campground.js";
import catchAsync from "../utils/catchAsync.js";
import { validateReview, isLoggedIn, isReviewAuthor } from '../middleware.js';

// create express router with params merged
const router = express.Router({ mergeParams: true });

// create new review and push it to campground data
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);

    review.author = req.user._id;
    campground.reviews.push(review);

    await review.save();
    await campground.save();
    req.flash("success", "Review submitted!");
    res.redirect(`/campgrounds/${campground._id}`);
}));

// delete review and it's reference in the campground
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/campgrounds/${id}`);
}));

export default router;