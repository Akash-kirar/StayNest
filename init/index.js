const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const dbUrl = process.env.ATLASDB_URI;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68ec19354dfc05db7d84089e",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};
initDB();
