const mongoose = require("mongoose");

module.exports = findHashtags = (query, options, cb) => {
  mongoose.connection.db.collection("hashtags", (err, collection) => {
    if (err) {
      console.log(err);
    }
    collection.find(query, options).toArray(cb);
  });
};

module.exports = addHashTag = (data) =>
  mongoose.connection.db.collection("hashtags", (err, collection) => {
    if (err) console.log(err);
    const res = collection.insertOne(data);
  });

const Hashtags = (module.exports = mongoose.models.hashtags);
