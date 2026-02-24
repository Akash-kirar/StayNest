// prints all listings from the local `wanderlust` MongoDB database
// usage: node scripts/showAllListings.js

const mongoose = require('mongoose');
const Listing = require('../models/listing');
// ensure User model is registered for populate()
require('../models/user');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

(async () => {
  try {
    await mongoose.connect(MONGO_URL);
    const listings = await Listing.find({}).populate('owner').populate('reviews');
    console.log(`Found ${listings.length} listing(s):`);
    for (const l of listings) {
      console.log('-----------------------------');
      console.log(`id:      ${l._id}`);
      console.log(`title:   ${l.title || '<no title>'}`);
      console.log(`location:${l.location || '<no location>'} ${l.country ? `, ${l.country}` : ''}`);
      console.log(`price:   ${typeof l.price !== 'undefined' ? l.price : '<no price>'}`);
      console.log(`owner:   ${l.owner ? (l.owner.username || l.owner._id) : '<no owner>'}`);
      console.log(`reviews: ${Array.isArray(l.reviews) ? l.reviews.length : 0}`);
      console.log(`image:   ${l.image && l.image.url ? l.image.url : '<no image>'}`);
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error fetching listings:', err);
    try { await mongoose.disconnect(); } catch(e){}
    process.exit(1);
  }
})();
