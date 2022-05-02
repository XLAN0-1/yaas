const express = require("express");
const bodyParser = require("body-parser");
const auctionRouter = require("../routes/auction");
const bidRouter = require("../routes/bid");
const adminRouter = require("../routes/admin")
const PORT = process.env.PORT || 5050;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
// // parse application/json
// app.use(bodyParser.json())

app.use("/", auctionRouter);
app.use("/", bidRouter);
app.use("/", adminRouter);

module.exports = app;