const mongoose = require("mongoose");  
const { type } = require("os");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: {
      type: String,
      default: "https://www.istockphoto.com/photo/a-tropical-beach-sunset-on-a-beautiful-day-gm117146711-16216216",
      set: (v) => v=== "" ? "https://www.istockphoto.com/photo/a-tropical-beach-sunset-on-a-beautiful-day-gm117146711-16216216" : v,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;