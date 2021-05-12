const mongoose = require("mongoose");

//post schema

const hashtagTrendsSchema = new mongoose.Schema();

module.exports = findHashtagTrends = (query, options, cb) => {
  mongoose.connection.db.collection("hashtrends", (err, collection) => {
    if (err) {
      console.log(err);
    }
    collection.find(query, options).toArray(cb);
  });
};

const hashtagTrends = (module.exports = mongoose.models.hashtagTrends);
