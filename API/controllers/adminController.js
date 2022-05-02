const { Auctions } = require("../DB/model");
const sendMessage = require("../controllers/emailController");

//Ban an auction
banAuction = async (req, res)=>{
    console.log("My guy tried banning an auction")
    id = req.body.id;

    Auctions.findOneAndUpdate({_id: id}, {isBanned: true})
    .then(auction => {
        console.log("Auction item is " + auction);
        //Send a message to the seller
        sendMessage.sendBanMessageForSeller(auction.sellerEmail, auction.title);

        //Try sending a message to all bidders if there are any bidders
        try{
            const bidders = auction.bids;
            //Filter through the array
            const uniqueBidders = []
            bidders.forEach(item=>{
                if(!uniqueBidders.includes(item.email)){
                    uniqueBidders.push(item.email);
                }
            });

            console.log("Unique bidders are " + uniqueBidders);
            
            //Send message to each of the user
            uniqueBidders.forEach( (element) => {
                console.log("I was called");
                sendMessage.sendBanMessageForBidders(element, auction.title, auction.sellerName);
            });

        }catch(error){
            res.status(500).send(error);
        }

        res.status(200).send("Auction successfully banned");
    })

}

module.exports = {
    banAuction
}