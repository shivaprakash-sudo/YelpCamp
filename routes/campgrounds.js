
// import necessary modules
import express from "express";
import Campground from "../models/campground.js";
import catchAsync from "../utils/catchAsync.js";
import ExpressError from "../utils/ExpressError.js";
import { campgroundSchema } from "../schemas.js";
import isLoggedIn from "../middleware.js";

// create express router
const router = express.Router();

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

// all campgrounds page
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

// new campground page
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

// save new campground data
router.post('/', validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully created a new campground!");
    res.redirect(`/campgrounds/${campground._id}`)
}));

// show the campground data and populate with reviews
router.get('/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    if (!campground) {
        req.flash("error", "Sorry, we can't find that campground.");
        return res.redirect("/campgrounds");
    }
    res.render('campgrounds/show', { campground });
}));

// campground edit page
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Sorry, we can't find that campground.");
        return res.redirect("/campgrounds");
    }
    res.render('campgrounds/edit', { campground });
}));

// update campground data
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

// delete campground data
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
}));

// export the router
export default router;