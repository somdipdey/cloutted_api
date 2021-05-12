const mongoose = require("mongoose");

//publickey schema
const userSchema = new mongoose.Schema({
  PublicKeyBase58Check: {
    type: String,
    required: true,
    unique: true,
  },
  Username: {
    type: String,
  },
  postsUpdateOn: {
    type: Date,
    default: new Date(),
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
});

const User = (module.exports =
  mongoose.models.user || mongoose.model("user", userSchema));
