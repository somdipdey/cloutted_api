const mongoose = require("mongoose");

module.exports = findHashtags = (query, options, cb) => {
  mongoose.connection.db.collection("hashtags", (err, collection) => {
    if (err) {
      console.log(err);
    }
    collection.find(query, options).toArray(cb);
  });
};

module.exports = getTrendings = (timeQuery, limit, cb) => {
  mongoose.connection.db.collection("hashtags", async (err, collection) => {
    if (err) {
      console.log(err);
    }
    const res = await collection
      .aggregate([
        { $match: timeQuery },
        {
          $group: { _id: "$hashtag", count: { $sum: 1 } },
        },
        { $sort: { count: -1 } },
        { $limit: parseInt(limit) },
        {
          $project: {
            _id: 0,
            hashtag: "$_id",
            //  count: 1
          },
        },
      ])
      .toArray(cb);
  });
};

module.exports = getNumberHashtags = () =>
  new Promise((resolve, _) => {
    mongoose.connection.db.collection("hashtags", (err, collection) => {
      if (err) {
        console.log(err);
      }
      resolve(collection.countDocuments());
    });
  });

module.exports = addHashTag = (data) =>
  mongoose.connection.db.collection("hashtags", (err, collection) => {
    if (err) console.log(err);
    const res = collection.insertOne(data);
  });

const Hashtags = (module.exports = mongoose.models.hashtags);
