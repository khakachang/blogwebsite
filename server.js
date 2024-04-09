const express = require("express");
const ejs = require("ejs");
const app = express();
const path = require("path");
const port = 8000;
const mysql = require("mysql");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer = require('multer');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/thumbnails');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});


// Create the multer instance with the storage options
const upload = multer({ storage: storage });
app.use(session({
    secret: 'wakuwaku-haha-emmm',
    resave: false,
    saveUninitialized: true
}));

async function hashPassword(password) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
}

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Iamayoutuber123@',
    database: 'users'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('Connected to the database');
});

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the public directory
app.use(express.static("public"));

// Define routes

// Render the index.ejs template for the root URL
app.get("/", (req, res) => {
    // Retrieve all blog posts from the database
    const queryString = "SELECT * FROM Blog";
    connection.query(queryString, (err, results) => {
        if (err) {
            console.error('Error retrieving blog posts: ', err);
            res.status(500).send('Error retrieving blog posts');
            return;
        }
        
        // Modify the thumbnail_path to remove the '/public' part
        const modifiedResults = results.map(blog => {
            if (blog.thumbnail_path) {
                blog.thumbnail_path = blog.thumbnail_path.replace('/public', '');
            }
            return blog;
        });

        // Render the index page and pass the blog posts data to the template
        res.render("index", { username: req.session.username, blogs: modifiedResults });
    });
});



// Render the signIn.ejs template for the /signIn route
app.get("/signIn", (req, res) => {
    res.render("signIn");
});
////////////////////////////////////
// Handle user sign-in
app.post("/signIn", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Retrieve the user from the database based on the username
        const queryString = "SELECT * FROM users WHERE username = ?";
        connection.query(queryString, [username], async (err, results) => {
            if (err) {
                console.error('Error retrieving user: ', err);
                res.status(500).send('Error signing in');
                return;
            }

            if (results.length === 0) {
                // User not found
                res.status(401).send('Invalid username or password');
                return;
            }

            // Check if the password matches
            const user = results[0];
            const passwordMatches = await bcrypt.compare(password, user.password_hash);
            if (!passwordMatches) {
                // Password doesn't match
                res.status(401).send('Invalid username or password');
                return;
            }

            // Authentication successful
            req.session.username = username; // Store the username in the session
            res.redirect("/"); // Redirect the user to the home page
        });
    } catch (error) {
        console.error('Error signing in: ', error);
        res.status(500).send('Error signing in');
    }
});
//////////////////////
// Handle user sign-out
app.get("/signOut", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

// Render the register.ejs template for the /Register route
app.get("/Register", (req, res) => {
    res.render("register");
});

// Render the post.ejs template for the /Post route
app.get("/Post", (req, res) => {
    res.render("post");
});


////////////////////////////////////////////////////////////
// Handle user registration
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash the password
        const passwordHash = await hashPassword(password);

        // Insert the new user into the database
        const queryString = "INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)";
        const createdAt = new Date();
        
        connection.query(queryString, [username, passwordHash, createdAt], (err, result) => {
            if (err) {
                console.error('Error registering user: ', err);
                res.status(500).send('Error registering user');
                return;
            }
            console.log('User registered successfully');
            res.redirect("/signIn"); // Redirect the user to the sign-in page after successful registration
        });
    } catch (error) {
        console.error('Error hashing password: ', error);
        res.status(500).send('Error registering user');
    }
});


////////////////////////////////////////////////////////////

// Handle blog post submission
app.post("/post", upload.single('thumbnail'), async (req, res) => {
    const { title, content } = req.body;
    let thumbnailPath = req.file.path;

    // Replace backslashes with forward slashes in the file path
    thumbnailPath = thumbnailPath.replace(/\\/g, '/');

    // Remove the "/public" part from the beginning of the path
    thumbnailPath = thumbnailPath.replace(/^\/public/, '');

    try {
        // Assuming the user is logged in and you have access to the user_id from the session
        const user_id = req.session.user_id; // Ensure you set this value somewhere in your code

        // Insert the new blog post into the database
        const queryString = "INSERT INTO Blog (title, content, thumbnail_path, user_id) VALUES (?, ?, ?, ?)";
        connection.query(queryString, [title, content, thumbnailPath, user_id], (err, result) => {
            if (err) {
                console.error('Error creating blog post: ', err);
                res.status(500).send('Error creating blog post');
                return;
            }
            console.log('Blog post created successfully');
            res.redirect("/"); // Redirect the user to the home page after successful blog post creation
        });
    } catch (error) {
        console.error('Error creating blog post: ', error);
        res.status(500).send('Error creating blog post');
    }
});



//////////////////////////////////

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
