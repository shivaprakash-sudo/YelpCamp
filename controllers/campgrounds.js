import Campground from "../models/campground.js";
import catchAsync from "../utils/catchAsync.js";
import { cloudinary } from '../cloudinary/index.js';
import Geocoding from "@mapbox/mapbox-sdk/services/geocoding.js";

const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;

const geoCoder = Geocoding({ accessToken: mapboxToken });

const index = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({}).sort({ $natural: -1 });
    res.render('campgrounds/index', { campgrounds })
});

const newCampgroundForm = (req, res) => {
    res.render('campgrounds/new');
};

const createCampground = catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);

    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    })
        .send()
        .then(response => {
            const match = response.body;
            // console.log(match);
            campground.geometry = match.features[0].geometry;

        });

    campground.author = req.user._id;

    req.files.forEach(file => {
        const image = {
            path: file.path,
            fileName: file.filename
        };
        campground.images.push(image);
    });

    await campground.save();
    // console.log(campground);
    req.flash("success", "Successfully created a new campground!");
    res.redirect(`/campgrounds/${campground._id}`)
});

const showCampground = catchAsync(async (req, res,) => {
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
});

const editCampgroundForm = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Sorry, we can't find that campground.");
        return res.redirect("/campgrounds");
    }
    res.render('campgrounds/edit', { campground });
});

const updateCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });

    req.files.forEach(file => {
        const image = {
            path: file.path,
            fileName: file.filename
        };
        campground.images.push(image);
    });
    await campground.save();

    if (req.body.deleteImages) {
        await campground.updateOne({
            $pull: {
                images: {
                    fileName: {
                        $in: req.body.deleteImages
                    }
                }
            }
        });
        req.body.deleteImages.forEach(file => {
            cloudinary.uploader.destroy(file, (err, result) => console.log(result, err));
        });
    }

    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground._id}`)
});

const deleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
});

export { index, newCampgroundForm, createCampground, showCampground, editCampgroundForm, updateCampground, deleteCampground };