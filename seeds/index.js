import mongoose from "mongoose";
import { cities } from "./cities.js";
import { places, descriptors } from "./seedHelpers.js";
import Campground from "../models/campground.js";

mongoose
    .connect("mongodb://localhost/yelp-camp", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to Mongoose");
    })
    .catch((err) => {
        console.log("ERROR CONNECTING TO MONGOOSE!!!");
        console.log(err);
    });

const seedDb = async () => {
    await Campground.deleteMany({});

    const sample = array => array[Math.floor(Math.random() * array.length)];

    const price = Math.floor(Math.random() * 20) + 10;

    const random1000 = Math.floor(Math.random() * cities.length);

    try {
        // create a 100 random campgrounds
        for (let i = 0; i < 100; i++) {
            const newCamp = new Campground({
                title: `${sample(descriptors)} ${sample(places)}`,
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                image: "https://source.unsplash.com/collection/483251",
                description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni voluptatem, vitae totam dolore facilis quos, voluptates a inventore aut est consequatur atque fugiat dolores, distinctio ducimus ipsum aspernatur in tenetur?",
                price,
            });
            await newCamp.save();
        }
    } catch (error) {
        console.log(error);
    }
};

seedDb().then(() => mongoose.connection.close());