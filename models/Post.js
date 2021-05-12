const mongoose = require("mongoose");

//post schema
const postSchema = new mongoose.Schema();

module.exports = findPosts = (query, options, cb) => {
  mongoose.connection.db.collection("posts", (err, collection) => {
    if (err) {
      console.log(err);
    }
    collection.find(query, options).toArray(cb);
  });
};

const Post = (module.exports = mongoose.models.post);
