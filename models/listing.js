const mongoose = require("mongoose");  
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: String,
    description: String,
    image: String,
    
    country: String
});