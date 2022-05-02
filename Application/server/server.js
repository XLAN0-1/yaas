const express = require("express");
require('dotenv').config();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRouter = require(".././routes/user");
const auctionRouter = require(".././routes/auction");
const bidRouter = require(".././routes/bid");
const accountRouter = require(".././routes/account");
const adminRouter = require(".././routes/admin");



const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");




app.use("/", userRouter);
app.use("/", auctionRouter);
app.use("/", bidRouter);
app.use("/", accountRouter);
app.use("/", adminRouter);


module.exports = app;


//Create the register/login page
//Create a become a seller page and update the user to be a seller
//TYpes of users - anonymous, registered and admin
//Create a dashbord for the user where they can see all their bids and edit their information
//Allow user to create a new auction but only when they become a seller
//Allow user to edit the description of an auction

//Create a page for searching and browsing the auctions
//Create the bid page

//Allow an admin to be able to ban an auction
