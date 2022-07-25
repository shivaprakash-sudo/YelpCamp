import Review from "../models/review.js";
import Campground from "../models/campground.js";
import catchAsync from "../utils/catchAsync.js";

// create new review and push it to campground data
const createReview = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);

    review.author = req.user._id;
    campground.reviews.push(review);

    await review.save();
    await campground.save();
    req.flash("success", "Review submitted!");
    res.redirect(`/campgrounds/${campground._id}`);
});

// delete review and it's reference in the campground
const deleteReview = catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/campgrounds/${id}`);
});

export { createReview, deleteReview };