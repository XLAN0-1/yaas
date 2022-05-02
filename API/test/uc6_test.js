const supertest = require("supertest");
const mongoose = require("mongoose");
const { Auctions } = require("../DB/model");
const app = require("../server/server");
const assert = require("assert");
const request = supertest(app);

//Variables to use for the test
var seedId;
const seedEmail = "seed@seed.com";
const seedCurrency = "EUR";

//Messages
const userBiddingOnOwnAuction = "You cant't bid on your own auction.";
const bidUnsuccessful = "Your bid is invalid";
const bidSuccessful = "Your bid is valid";

//Connect to a local mongodb first to do the tests
before(async () => {
  const DATABASE_URI = "mongodb://localhost:27017/test";
  await mongoose.connect(DATABASE_URI);
});

//After each test clear the local database to avoid duplicate files
afterEach(async () => {
  await Auctions.deleteMany();
});

// afterAll(async ()=>{
//   //Close the mongoose collection after all tests
//   mongoose.connection.close();
// })

//Seed the database with one auction to use for the test of bidding
seedDatabase = async () => {
  const auction = new Auctions({
    _id: seedId,
    sellerName: "Seed",
    sellerEmail: seedEmail,
    currency: seedCurrency,
    title: "Seed Auction",
    description: "This is a seed auction",
    minPrice: 1000,
    bids: [{ email: "first@seed.com", bid: 1100 }],
    isActive: true,
    isConfirmed: true,
    isBanned: false,
    test: true,
  });

  await auction.save();
  await Auctions.findOne({ title: "Seed Auction" })
    .then((result) => {
      seedId = String(result._id);
    })
    .catch((error) => {
      seedId = null;
    });
};

describe("This should test all scenarios for posting a bid on an auction", () => {

  it("Bid shouldn't be accepted because it is placed by seller", async () => {
    await seedDatabase();

    const response = await request.post("/bid").type("form").send({
      id: seedId,
      userEmail: seedEmail,
      bid: 5000,
      currency: seedCurrency,
    });

    assert(response.text === userBiddingOnOwnAuction);
  });

  it("Bid shouldn't be accepted because it is lower than the minimum price", async () => {
    await seedDatabase();

    const response = await request.post("/bid").type("form").send({
      id: seedId,
      userEmail: "seed2@gmail.com",
      bid: 500,
      currency: seedCurrency,
    });

    assert(response.text === bidUnsuccessful);
  });

  it("Bid shouldn't be accepted because it is not higher than the previous bid by 0.01", async () => {
    await seedDatabase();

    const response = await request.post("/bid").type("form").send({
      id: seedId,
      userEmail: "seed2@gmail.com",
      bid: 1101,
      currency: seedCurrency,
    });

    assert(response.text === bidUnsuccessful);
  });

  it("Bid should be accepted because it meets all the criteria", async () => {
    await seedDatabase();

    const response = await request.post("/bid").type("form").send({
      id: seedId,
      userEmail: "seed2@gmail.com",
      bid: 2000,
      currency: seedCurrency,
    });

    assert(response.text === bidSuccessful);
  });
});
