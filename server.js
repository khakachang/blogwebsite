const express = require("express");
const ejs = require("ejs");
const app = express();
const path = require("path");
const port = 8000;

//Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Serve static file from the public directory
app.use(express.static("public"));

//Define a route to render the index.ejs template
app.get("/", (req, res) => {
    res.render("index");
});

//Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});