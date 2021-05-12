const mongoose = require("mongoose");

//post schema
const hashtagsSchema = new mongoose.Schema();

module.exports = findHashtags = (query, options, cb) => {
  mongoose.connection.db.collection("hashtags", (err, collection) => {
    if (err) {
      console.log(err);
    }
    collection.find(query, options).toArray(cb);
  });
};

module.exports = findHashtagsBySearchTerm = (query, options, cb) => {
  mongoose.connection.db.collection("hashtags", (err, collection) => {
    if (err) {
      console.log(err);
    }
    collection.find({"hashtag" : {$regex: query, options }}).toArray(cb);
  });
};

const Hashtags = (module.exports = mongoose.models.hashtags);
