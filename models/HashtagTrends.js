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
      if (!resData) {
        const newHashtagTrend = {
          hashtag,
          count: 1,
        };
        collection.insertOne(newHashtagTrend);
        resolve();
        return;
      } else {
        const count = parseInt(resData.count) + 1;
        const newObject = { ...resData, count };
        try {
          await collection.findOneAndReplace({ _id: resData._id }, newObject);
        } catch (err) {
          console.log(err);
        }
        resolve();
      }
    });
  });
};

const hashtagTrends = (module.exports = mongoose.models.hashtagTrends);
