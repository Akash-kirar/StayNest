// usage: node scripts/findByTitle.js "Title to search"
const mongoose = require('mongoose');
const Listing = require('../models/listing');
require('../models/user');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const title = process.argv[2];
if(!title){
  console.error('Provide a title argument, e.g. node scripts/findByTitle.js "Cozy Beachfront Cottage"');
  process.exit(1);
}
(async ()=>{
  try{
    await mongoose.connect(MONGO_URL);
    const listings = await Listing.find({ title: title }).populate('owner');
    console.log(`Found ${listings.length} listing(s) with title: "${title}"`);
    listings.forEach(l =>{
      console.log('-----------------------------');
      console.log(`id: ${l._id}`);
      console.log(`title: ${l.title}`);
      console.log(`location: ${l.location || '<no location>'} ${l.country? ', '+l.country : ''}`);
      console.log(`price: ${l.price}`);
      console.log(`owner: ${l.owner ? (l.owner.username || l.owner._id) : '<no owner>'}`);
      console.log(`image url: ${l.image && l.image.url ? l.image.url : '<no image>'}`);
    })
    await mongoose.disconnect();
    process.exit(0);
  }catch(err){
    console.error('Error:', err);
    try{await mongoose.disconnect()}catch(e){}
    process.exit(1);
  }
})();
