const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  fullName: String,
  currency: String,
  auctions: [],
  type: String,
});

const auctionSchema = new mongoose.Schema({
  sellerName: String,
  sellerEmail: String,
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  minPrice: Number,
  deadline: Date,
  bids: [],
  isActive: Boolean,
  currency: String,
  isConfirmed: Boolean,
  isBanned: Boolean,
  test: Boolean,
});

const Auctions = mongoose.model("Auction", auctionSchema);
const Users = mongoose.model("User", userSchema);

module.exports = {
  Auctions,
  Users,
};
