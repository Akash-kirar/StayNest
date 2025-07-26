const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path =require("path");
const { render } = require("ejs");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() =>{
    console.log("connected to DB")
}).catch((err) =>{
    console.log(err);
});


async function main() {
    await mongoose.connect(MONGO_URL);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("hi , i am root");
});

//index route
app.get("/listings", async (req, res) => {
  const allListings= await Listing.find({});
res.render("listings/index.ejs", {allListings});
    });



    //new route top on the show route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


    //show route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", {listing});
});




// app.get("/Testlisting", async (req, res) => {
//   let samleListing = new Listing({
//     title: "my new villa",
//     description: "by the beach",
//     price: 1200,
//     location: "goa",
//     country: "india",

//   });
//   await samleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing")
// });

app.listen (8080, () =>{
    console.log("server is listing to port 8080");
});