import express from 'express';
import expressLayouts from 'express-ejs-layouts';

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

app.use(expressLayouts);

app.get("/", (req, res) => {
    res.send("Hurray! It's working.");
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));