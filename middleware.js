import { campgroundSchema, reviewSchema } from "./schemas.js";
import ExpressError from "./utils/ExpressError.js";
import Campground from "./models/campground.js";
import Review from "./models/review.js";

// check if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

// check the author permission for the campground
const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "Sorry, you do not have permission for this action.");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

// check the author permission for the review
const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "Sorry, you do not have permission for this action.");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

// validate campground using Joi
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

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

export { isLoggedIn, validateCampground, validateReview, isAuthor, isReviewAuthor };