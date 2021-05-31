const mongoose = require("mongoose");

//post schema

const collectionName = "hashtrends";

const hashtagTrendsSchema = new mongoose.Schema();

module.exports = findHashtagTrends = (query, options, cb) => {
  mongoose.connection.db.collection(collectionName, (err, collection) => {
    if (err) {
      console.log(err);
    }
    collection.find(query, options).toArray(cb);
  });
};

module.exports = insertHashtagTrend = (hashtag) => {
  mongoose.connection.db.collection(collectionName, (err, collection) => {
    collection.findOne({ hashtag }, (err, resData) => {
      if (!resData) {
        const newHashtagTrend = {
          hashtag,
          count: 1,
        };
        collection.insertOne(newHashtagTrend);
        return;
      } else {
        const count = parseInt(resData.count) + 1;
        const newObject = { ...resData, count };
        try {
          collection.findOneAndReplace({ _id: resData._id }, newObject);
        } catch (err) {
          console.log(err);
        }
      }
    });
  });
};

const hashtagTrends = (module.exports = mongoose.models.hashtagTrends);
