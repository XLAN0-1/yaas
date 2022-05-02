const { Auctions } = require("../DB/model");
const sendMessage = require("./emailController");
const fetch = require("node-fetch");


//Ban an auction
banAuction = async (req, res)=>{
    id = req.body.id;

    const url ="http://localhost:5050/ban";

    const body = {
        id: id
    }

    const options = {
        method: "POST",
        body: new URLSearchParams(body),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
    }

    const result = await fetch(url, options)
    .then(response => response.text())
    .then(text => text);

    console.log(result);

}

//get all auctions
getAllAuctions = async(req, res)=>{
    const url = "http://localhost:5050/allAuctions";

    const data = await fetch(url)
    .then(response => response.json())
    .then(text => text.data);

    console.log(data);

    res.render("admin", {auctions: data});
}

getTestData = async(req, res)=>{
    const url = "http://localhost:5050/generateTestData";

    
    const data = await fetch(url)
    .then(response => response.text())
    .then(text => text.data);

    res.redirect("/");
}

module.exports = {
    banAuction,
    getAllAuctions,
    getTestData
}