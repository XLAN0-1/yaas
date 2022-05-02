const express = require("express");
const bidController = require("../controllers/bidController")

const router = express.Router();


router.post("/bid", bidController.userCanBid, bidController.postNewBid);


module.exports = router;