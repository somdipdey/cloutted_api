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

module.exports = insertHashtagTrend = (hashtag) => {
  mongoose.connection.db.collection("hashtrends", (err, collection) => {
    collection.findOne({ hashtag }, (err, resData) => {
      if (!resData) return collection.insertOne(resData);
      collection.findOneAndUpdate(
        { _id: resData._id },
        { count: resData.count + 1 }
      );
    });
  });
};

const hashtagTrends = (module.exports = mongoose.models.hashtagTrends);
