const mongoose = require("mongoose");
const DATABASE_URI =
  "mongodb+srv://admin-lana:test123@cluster0.4ltqi.mongodb.net/yaas";

mongoose.connect(DATABASE_URI);

const app = require("./server/server");


app.listen(3000, (req, res) => {
  console.log("Server started");
});
