
// import necessary modules
import express from "express";
import multer from "multer";
import { isLoggedIn, validateCampground, isAuthor } from "../middleware.js";
import { index, newCampgroundForm, createCampground, showCampground, editCampgroundForm, updateCampground, deleteCampground } from "../controllers/campgrounds.js";
import { storage } from "../cloudinary/index.js";

// create express router
const router = express.Router();

// upload destination
const upload = multer({ storage })

// route for all campgrounds and campground creation
router.route("/")
    .get(index)
    .post(isLoggedIn, upload.array("image"), validateCampground, createCampground);

// new campground page
router.get('/new', isLoggedIn, newCampgroundForm);

// route for showing, updating and deleting campgrounds
router.route("/:id")
    .get(showCampground)
    .put(isLoggedIn, isAuthor, validateCampground, updateCampground)
    .delete(isLoggedIn, isAuthor, deleteCampground);

// campground edit page
router.get('/:id/edit', isLoggedIn, isAuthor, editCampgroundForm);


// export the router
export default router;