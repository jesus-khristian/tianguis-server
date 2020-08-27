const path = require("path");

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const helmet = require ('helmet');
const morgan = require ('morgan');

const http = require("http").createServer(app);

const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/item");
const userRoutes = require("./routes/user");


app.set('port', process.env.PORT);

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/images");
    },
    filename: (req, file, cb) => {
        cb(null, Math.floor(Math.random() * 90000) + 10000 + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") 
        cb(null, true);
     else 
        cb(null, false);
    
};


const upload = multer({storage: fileStorage, fileFilter: fileFilter});

//middlewares
app.use(morgan('tiny'));
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

// set headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader("Access-Control-Allow-Origin", "https://tianguis-server.herokuapp.com/*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
   // res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use("/auth", upload.array("images", 10), authRoutes);
app.use("/seller", upload.single("image"), itemRoutes);
app.use(userRoutes);

// error middleware
app.use((error, req, res, next) => {
    console.log(error + "--------------------------");
    const statusCode = error.statusCode || 500;
    const message = error.message;
    let errorsPresent;
    if (error.errors) {
        errorsPresent = error.errors;
    }

    res.status(statusCode).json({message: message, errors: errorsPresent});
});


module.exports = {
    app,
    http
};


// socket io
require("./config/socket");
