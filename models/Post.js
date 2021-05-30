const mongoose = require("mongoose");

const collectionName = "posts";

//post schema
const postSchema = new mongoose.Schema();

module.exports = findPosts = (query, options, cb) => {
  mongoose.connection.db.collection(collectionName, (err, collection) => {
    if (err) {
      console.log(err);
    }
    collection.find(query, options).toArray(cb);
  });
};

module.exports = postDoesExist = (PostHashHex) =>
  new Promise((resolve, _) => {
    findPosts({ PostHashHex }, { limit: 1 }, (err, posts) => {
      if (posts && posts.length > 0) resolve(true);
      else resolve(false);
    });
  });

module.exports = addPost = (data) => {
  mongoose.connection.db.collection(collectionName, (err, collection) => {
    if (err) console.log(err);
    const res = collection.insertOne(data);
  });
};

const Post = (module.exports = mongoose.models.post);
