import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// checks to see if development dependencies are required or not
if (process.env.NODE_ENV != "production") {
    dotenv.config();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

app.use(expressLayouts);

// database connection
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

app.get("/", (req, res) => {
    res.render("home");
});