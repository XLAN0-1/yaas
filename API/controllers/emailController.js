const { google } = require("googleapis");
const nodemailer = require("nodemailer");

const CLIENT_ID =
  "890188043598-ggm0sukb0s4ea1fb7n70f4tjirt5t1p0.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REFRESH_TOKEN =
  "1//04vEwbs9vuBDACgYIARAAGAQSNwF-L9IruVj8cVarI7s6Ly7J0ygtNBAfiyJiD-ZjugFx0yPFxwiBMU1dpUpr60L7kUsmqLaOmuA";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMessage(address, subject, message) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "John55olu@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOptions = {
      from: "John55olu@gmail.com",
      to: address,
      subject: subject,
      html: message,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log(error);
  }
}

/***************************MAIL MESSAGES */


//Create function to generate confirmation email message for auction post
generateConfirmationEmail = (name, title, id) => {
  return `
    <p> Dear ${name} please click on the link to confirm posting the auction - ${title} </p> \n
    <a href="http://localhost:3000/auctions/${id}/confirm">Confirm auction</a> 
  `;
};

//generate email notifying bidders and sellers that an auction has ended
generateResolvedMessageForBidders = (title, seller) => {
  return `The following auction - ${title} posted by ${seller} has been resolved`;
};

generateResolvedMessageForSeller = (title) => {
  return `Your auction '${title}' has been resolved `;
};

//Generate email for when a bid is placed
generateSellerBidMessage = (buyer, item, bid, currency) => {
  return `<p>A new bid of ${currency}${bid} has been placed on your auction - ${item} by ${buyer}</p>`;
};

//generate mail body to send to latest bidder
generateLatestBidderBidMessage = (item) => {
  return `A new bid has been placed on ${item}`;
};

//Generate ban message for bidders
generateBanMessageForBidders = (title, seller)=>{
  return `The following auction - ${title} posted by ${seller} has been banned as it was found violating
  the terms of the site`
};

//generate ban message for sellers
generateBanMessageForSeller = (title)=>{
  return `Your auction '${title} has been banned for violating the terms of the site' `;
}


/*********************MAIL FUNCTIONS ***********************/
//Send ban message to bidders
sendBanMessageForBidders = (toAddr, title, seller) =>{
  sendMessage(toAddr, "Ban of auction!!", generateBanMessageForBidders(title, seller));
}

//send ban message to seller
sendBanMessageForSeller = (toAddr, title) =>{
  sendMessage(toAddr, "Ban of auction!!", generateBanMessageForSeller(title));
}
//Send seller a mail when a new bid has been placed
sendSellerBidMail = (sellerAddress, bidder, auctionItem, bidPrice, currency) => {
  sendEmail(
    sellerAddress,
    "New bid placed on auction",
    generateSellerBidMessage(bidder, auctionItem, bidPrice, currency)
  )
    .then((result) => console.log("Email sent to seller"))
    .catch((error) => console.log(error));
};

//send Latest bidder a mail when a new bid has been placed
sendLatestBidderMail = (bidderAddress, item) => {
  sendEmail(
    bidderAddress,
    "New bid placed on auction",
    generateLatestBidderBidMessage(item)
  )
    .then((result) => console.log("Email sent to latest bidder"))
    .catch((error) => console.log(error));
};


//Send email that an auction has ended
sendAuctionHasEndedMail = (auction) => {
  //Send the seller the mail
  sendMessage(
    auction.sellerEmail,
    "Auction Resolved",
    generateResolvedMessageForSeller(auction.title)
  );

  //Try sending a message to all bidders if there are any bidders
  try {
    const bidders = auction.bids;
    //Filter through the array
    const uniqueBidders = [];
    bidders.forEach((item) => {
      if (!uniqueBidders.includes(item.email)) {
        uniqueBidders.push(item.email);
      }
    });

    console.log("Unique bidders are " + uniqueBidders);

    //Send message to each of the user
    uniqueBidders.forEach((element) => {
      console.log("I was called");
      sendMessage(
        element.email,
        "Auction Resolved",
        generateResolvedMessageForBidders(auction.title, auction.sellerName)
      );
    });
  } catch (error) {
    console.log(error);
  }
};

sendConfirmationMail = (sellerEmail, sellerName, title, id) => {
  sendMessage(
    sellerEmail,
    "Confirmation of Auction",
    generateConfirmationEmail(sellerName, title, id)
  );
};
module.exports = {
  sendAuctionHasEndedMail,
  sendConfirmationMail,
  sendLatestBidderMail,
  sendSellerBidMail,
  sendBanMessageForSeller,
  sendBanMessageForBidders
};
