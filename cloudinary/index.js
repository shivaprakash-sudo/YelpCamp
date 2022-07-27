// checks to see if development dependencies are required or not
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

// modules to support "require" in ES6
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const cloudinary = require("cloudinary").v2;

import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

const cloudinaryParams = {
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
};

cloudinary.config(cloudinaryParams);

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "yelp-camp",
        allowedFormats: ["png", "jpeg", "jpg"]
    }
});

export { storage, cloudinary };