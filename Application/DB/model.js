const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  fullName: String,
  currency: String,
  auctions: []
});

const auctionSchema = new mongoose.Schema({
  sellerName: String,
  sellerEmail: String,
  title: String,
  description: String,
  minPrice: Number,
  deadline: Date,
  bids: [],
  isActive: Boolean,
  currency: String,
  isConfirmed: Boolean,
  isBanned: Boolean,
});

const Auctions = mongoose.model("Auction", auctionSchema);
const Users = mongoose.model("User", userSchema);

module.exports = {
  Auctions,
  Users,
};
