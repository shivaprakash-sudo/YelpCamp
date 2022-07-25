// import necessary modules
import express from "express";
import Review from "../models/review.js";
import Campground from "../models/campground.js";
import catchAsync from "../utils/catchAsync.js";
import { reviewSchema } from "../schemas.js";
import ExpressError from "../utils/ExpressError.js";

// create express router
const router = express.Router({ mergeParams: true });

// validate review using Joi
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// create new review and push it to campground data
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);

    campground.reviews.push(review);

    await review.save();
    await campground.save();
    req.flash("success", "Review submitted!");
    res.redirect(`/campgrounds/${campground._id}`);
}));

// delete review and it's reference in the campground
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/campgrounds/${id}`);
}));

export default router;