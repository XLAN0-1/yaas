const supertest = require("supertest");
const mongoose = require("mongoose");
const { Auctions } = require("../DB/model");
const app = require("../server/server");
const assert = require("assert");
const request = supertest(app);

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

describe("This should  test all scenarios for posting an auction", () => {
  it("Auction shouldn't be added becuase title is blank", async () => {
    const response = await request.post("/auction").type("form").send({
      name: "Lana Olubowale",
      email: "Lana12olu@gmail.com",
      currency: "NGN",
      description: "An auction without a title",
      auctionMinPrice: 180000,
      test: true
    });

    //The server should respond with status of 500 because the auction has no
    //title
    assert(response.statusCode === 500);
  });

  it("Auction shouldn't be added because the description is blank", async () => {
    const response = await request.post("/auction").type("form").send({
      name: "Lana Olubowale",
      email: "Lana12olu@gmail.com",
      currency: "NGN",
      title: "Auction test",
      auctionMinPrice: 180000,
      test: true
    });

    //The server should respond with status of 500 because the auction has no
    //title
    assert(response.statusCode === 500);
  });

  it("Auction should be added but shouldn't be confirmed", async () => {
    var auctionName = "Unconfirmed auction test";
    const response = await request.post("/auction").type("form").send({
      name: "Lana Olubowale",
      email: "Lana12olu@gmail.com",
      currency: "NGN",
      title: auctionName,
      description: "An auction with a title",
      auctionMinPrice: 180000,
      test: true
  
    });

    //Verify that auction was added to database
    assert(response.statusCode === 200);

    //Find the auction that was just uploaded an see if it is confirmed
    await Auctions.findOne({ title: auctionName }).then((result) => {
      //Auction was found so now check that the isConfirmed field is false
      assert(result.isConfirmed === false);
    });
  });


  it("Auction description should be updated", async () => {
    const auctionName = "Update description test";
    const oldDescription = "This is the old description";
    const newDescription = "This is the new description";

    const response = await request.post("/auction").type("form").send({
      name: "Lana Olubowale",
      email: "Lana12olu@gmail.com",
      currency: "NGN",
      title: auctionName,
      description: oldDescription,
      auctionMinPrice: 180000,
      test: true
    });

    // Verify that auction was added to database
    assert(response.statusCode === 200);

    let id;
    //Find the auction that was just uploaded an see if it is confirmed
    await Auctions.findOne({ title: auctionName })
      .then((result) => {
        id = result._id;
      })
      .catch((error) => {
        id = null;
      });

    //Update the description of an id
    const updateResponse = await request.patch(`/update`)
    .type('form').send({
      id: id,
      description: newDescription
    });

    assert(updateResponse.statusCode === 200);

  });
});
