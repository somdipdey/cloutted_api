const mongoose = require("mongoose");

//post schema
const postSchema = mongoose.Schema({});

const Post = (module.exports =
  mongoose.models.post || mongoose.model("posts", postSchema));
