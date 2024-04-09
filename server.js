const express = require("express");
const ejs = require("ejs");
const app = express();
const path = require("path");
const port = 8000;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the public directory
app.use(express.static("public"));

// Define routes

// Render the index.ejs template for the root URL
app.get("/", (req, res) => {
    res.render("index");
});

// Render the signIn.ejs template for the /signIn route
app.get("/signIn", (req, res) => {
    res.render("signIn");
});
// Render the register.ejs template for the /Register route
app.get("/Register", (req, res) => {
    res.render("register");
});
// Render the post.ejs template for the /Register route
app.get("/Post", (req, res) => {
    res.render("post");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
