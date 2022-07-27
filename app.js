// checks to see if development dependencies are required or not
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

// import necessary modules
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import methodOverride from "method-override";
import ExpressError from "./utils/ExpressError.js";
import session from 'express-session';
import flash from "connect-flash";
import passport from 'passport';
import LocalStrategy from "passport-local";
import User from "./models/user.js";

// routers
import campRouter from './routes/campgrounds.js';
import reviewRouter from "./routes/reviews.js";
import userRouter from "./routes/users.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// create an express app
const app = express();
const PORT = 3000;

// establish database connection and listen for server requests
mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        // listening for requests
        app.listen(process.env.PORT || PORT);
        console.log("Connected to Mongoose");
    })
    .catch((err) => {
        console.log("Error connecting to Mongoose");
        console.log(err);
    });


// set views to the app
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

// use necessary modules for the app
app.use(expressLayouts);
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

// create session config values and use them
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// use connect-flash to alert success or error messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// use routers
app.use("/campgrounds", campRouter);
app.use("/campgrounds/:id/reviews", reviewRouter);
app.use("/", userRouter);


// home page 
app.get("/", (req, res) => {
    res.render("home");
});

// error handling

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something's wrong, I can feel it";
    console.log(JSON.stringify(err));
    res.status(statusCode).render("error", { err });
});