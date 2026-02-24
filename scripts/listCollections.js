// lists all collections in the local `wanderlust` MongoDB database
// usage: node scripts/listCollections.js

const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

(async () => {
  try {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection.db;
    const cols = await db.listCollections().toArray();
    if (!cols || cols.length === 0) {
      console.log('No collections found in database `wanderlust`.');
    } else {
      console.log('Collections in `wanderlust` DB:');
      for (const c of cols) console.log('- ' + c.name);
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error listing collections:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
})();
