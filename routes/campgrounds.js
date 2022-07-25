
// import necessary modules
import express from "express";
import Campground from "../models/campground.js";
import catchAsync from "../utils/catchAsync.js";
import { isLoggedIn, validateCampground, isAuthor } from "../middleware.js";

// create express router
const router = express.Router();

// all campgrounds page
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

// new campground page
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// save new campground data
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully created a new campground!");
    res.redirect(`/campgrounds/${campground._id}`)
}));

// show the campground data and populate with reviews
router.get('/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");

    if (!campground) {
        req.flash("error", "Sorry, we can't find that campground.");
        return res.redirect("/campgrounds");
    }
    res.render('campgrounds/show', { campground });
}));

// campground edit page
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Sorry, we can't find that campground.");
        return res.redirect("/campgrounds");
    }
    res.render('campgrounds/edit', { campground });
}));

// update campground data
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

// delete campground data
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
}));

// export the router
export default router;