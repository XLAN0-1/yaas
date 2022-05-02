const { Router } = require("express");
const express = require("express");
const { append } = require("express/lib/response");
const auctionController = require("../controllers/auctionController");


const router = express.Router();




//GET ROUTES
router.get("/allAuctions", auctionController.getAllAuctions);
router.get("/id/:id", auctionController.getAuctionById);
router.get("/auctions/:title", auctionController.getAuctionByTitle);
router.get("/auctions", auctionController.getActiveAuctions);
router.get("/:id/bids", auctionController.getBidHistory);
router.get("/confirm/:id", auctionController.confirmAuction);
router.get("/user/:email", auctionController.getUserAuctions);
router.get("/resolve", auctionController.resolveAuctions);
//POST ROUTES
router.post("/auction", auctionController.postAuction);

//PATCH ROUTES
router.patch("/update", auctionController.updateAuctionDescription);


module.exports = router;