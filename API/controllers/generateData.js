// const bcrypt = require("b")
const emails = [];
const { Users, Auctions } = require("../DB/model");

const firstNames = [
  "Samuel",
  "John",
  "Pickford",
  "Jane",
  "Amy",
  "Rachael",
  "Mike",
  "Johnny",
  "Thomas",
  "Polly",
  "Arthur",
  "Lizzie",
  "Leslie",
  "Gideon",
  "Harvey",
];

const lastNames = [
  "Blue",
  "Red",
  "Green",
  "Black",
  "White",
  "Gold",
  "Pink",
  "Stone",
  "Smith",
  "Yellow",
  "Purple",
  "Silver",
  "Look",
  "See",
  "Saw",
];

const titles = [
  "Lorem ipsum",
  "Dolor sit",
  "Interdum mauris",
  "Quisque fringilla",
  "Aliquam nibh",
  "Aliquam malesuada",
  "Convallis leo",
  "Nullam eu ",
  "Pharetra massa",
  "Morbi sit",
  "Donec sagittis",
  "Praesent ut",
  "Integer lobortis",
  "Vestibulum ante",
  "Faucibus orci",
  "Magna auctor",
  "pretium nulla",
  "In tempus",
  "Nunc mauris",
  "feugiat elementum",
  "Porttitor augue",
];

const descriptions = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Pellentesque sed eleifend sapien, ut vehicula nibh.",
  "Donec quam turpis, iaculis nec justo et, fermentum ultrices lectus.",
  "Pellentesque sem magna, mollis gravida sem et, tincidunt congue lacus.",
  "Morbi viverra turpis ut augue venenatis, et egestas risus porta.",
  "Suspendisse venenatis semper erat vitae auctor",
  "Donec purus dui, consequat vitae tempus non, lacinia tempus eros.",
  "Proin tincidunt eros cursus velit auctor, vel accumsan dui dapibus.",
  "Nam vel felis eleifend orci suscipit eleifend a vel nulla.",
  "Nullam eget dui consectetur ipsum viverra lacinia.",
  "Vestibulum iaculis tortor ante, vitae vulputate massa feugiat a.",
  "Proin nibh purus, dictum et magna vitae, tincidunt accumsan ipsum.",
  "Aenean sollicitudin ligula ut dolor condimentum placerat vel ut dui.",
  "Quisque scelerisque metus quis egestas sagittis.",
  "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
  "Praesent cursus lorem ipsum, id tempus nibh suscipit vitae.",
  "Suspendisse sollicitudin ex vel nulla accumsan, nec aliquam diam varius.",
  "Vestibulum ac urna faucibus, accumsan eros pulvinar, feugiat arcu.",
  "Nullam a ullamcorper elit, ut maximus nibh. Morbi lobortis velit quis ligula elementum, sit amet dignissim magna sollicitudin.",
  "Suspendisse eu mollis nisi. Nullam sapien nisl, aliquet vitae aliquam id, ultrices in arcu.",
];

//Select a random title
randomTitle = () => {
  return titles[Math.floor(Math.random() * 20)];
};

//Select a random description
randomDescription = () => {
  return descriptions[Math.floor(Math.random() * 20)];
};

//Generate a random number between 0 and the sepcified maximum
randomNumber = (max) => {
  return Math.floor(Math.random() * max);
};

//Generate a random full name
randomFullName = () => {
  return firstNames[randomNumber(15)] + " " + lastNames[randomNumber(15)];
};

//generate random email
randomEmail = (name, num) => {
  const email = name.replace(" ", "") + num + "@test.com";
  emails.push(email);
  return email;
};

randomCurrency = () => {
  const currencies = ["AED", "USD", "EUR", "CAD", "NGN"];
  return currencies[Math.floor(Math.random() * 5)];
};

generateRandomAuctions = () => {
  const users = generateRandomUsers();
  const auctions = [];

  //Use a for loop to generate random auctions
  for (j = 0; j < 50; j++) {
    //Generate minimum price
    const minimumPrice = 1000 + Math.floor(Math.random() * 1000);
    const month = Math.floor(Math.random() * 6) + 5;
    const day = Math.floor(Math.random() * 25) + 1;
    const deadline = new Date(`2022-${month}-${day}`);
    const bids = generateRandomBids(minimumPrice);
    const title = randomTitle();
    const description = randomDescription();


    //Get a random user from the users data
    const user = users[Math.floor(Math.random() * 50)];

    auctions.push({
      sellerName: user.fullName,
      sellerEmail: user.email,
      title: title,
      description: description,
      currency: user.currency,
      minPrice: minimumPrice,
      deadline: deadline,
      bids: bids,
      isActive: true,
      isConfirmed: true,
      isBanned: false,
      test: true,
    });
  }

  console.log(auctions);
  return {
    users,
    auctions,
  };
};

generateRandomBids = (minimumPrice) => {
  //Generate bids for auctions between a range of 1 -10
  const numOfBids = Math.floor(Math.random() * 10) + 1;
  const bids = [];
  var previousBid = minimumPrice;

  for (i = 1; i < numOfBids; i++) {
    const email = emails[Math.floor(Math.random() * 50)];
    const bid = previousBid + 150 * i;

    bids.push({
      email: email,
      bid: bid,
    });
  }

  return bids;
};

generateRandomUsers = () => {
  const users = [];
  for (i = 0; i < 50; i++) {
    const name = randomFullName();
    const currency = randomCurrency();
    const email = randomEmail(name, i);
    users.push({
      email: email,
      password: "$2b$05$M/5LvBXQTbih9As3PakMcuSABniMbduNiIP/KQ1cQP999aKi6sFCe",
      fullName: name,
      currency: currency,
      auctions: [],
      type: "test",
    });
  }
  return users;
};

generateTestData = (req, res) => {
  console.log("Test data generation called");
  const { users, auctions } = generateRandomAuctions();

  //Insert the data
  Auctions.insertMany(auctions, (err, result) => {
    if (!err) {
      res.status(200).send("Data generated");
    } else {
      console.log(err);
    }
  });
};

module.exports = {
  generateTestData,
};
