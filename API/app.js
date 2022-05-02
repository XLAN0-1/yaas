const mongoose = require("mongoose");
const DATABASE_URI =
  "mongodb+srv://admin-lana:test123@cluster0.4ltqi.mongodb.net/yaas";

mongoose.connect(DATABASE_URI);

const app = require("./server/server");
const auctionController = require("./controllers/auctionController");



//FUNCTION THAT KEEPS ON CHECKING IF THE AUCTION IS OVER
setInterval(auctionController.resolveAuctions, 30000);


app.listen(5050, (req, res)=>{
    console.log("API SERVER RUNNING");
})