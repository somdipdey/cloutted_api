"use strict";

// packages
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

// import local packages and files
const db_config = require("./config/database");

// initlialize app
const app = express();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

//parse json
app.use(express.json());

// set staic folder
app.use(express.static(path.join(__dirname, "public")));

// database connection
mongoose.connect(db_config.dbURI, db_config.options);
let db = mongoose.connection;

// check connection
db.once("open", () => {
  console.log("DB connection successful...");
});

// check for db for error
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// configure paths

// import router files
// api version 1
const hashtags = require("./routes/v1/hashtags");
const posts = require("./routes/v1/posts");

// register routes
app.use("/v1/hashtags", hashtags);
app.use("/v1/posts", posts);

// 404 route
app.get("*", (_, res) => {
  res.status(404).json({
    message: "The route you are requesting is not hosted on this server",
  });
});

// port config
const PORT = process.env.PORT || 5000;

// start server
const server = app.listen(PORT, () =>
  console.log(`\nServer started at port ${PORT}...`)
);

// dev util
if (process.env.NODE_ENV == "DEV" && process.env.PRINT_ROUTES) {
  function print(path, layer) {
    if (layer.route) {
      layer.route.stack.forEach(
        print.bind(null, path.concat(split(layer.route.path)))
      );
    } else if (layer.name === "router" && layer.handle.stack) {
      layer.handle.stack.forEach(
        print.bind(null, path.concat(split(layer.regexp)))
      );
    } else if (layer.method) {
      console.log(
        "%s \t \x1b[33m/%s\x1b[0m",
        layer.method.toUpperCase(),
        path.concat(split(layer.regexp)).filter(Boolean).join("/")
      );
    }
  }

  function split(thing) {
    if (typeof thing === "string") {
      return thing.split("/");
    } else if (thing.fast_slash) {
      return "";
    } else {
      var match = thing
        .toString()
        .replace("\\/?", "")
        .replace("(?=\\/|$)", "$")
        .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
      return match
        ? match[1].replace(/\\(.)/g, "$1").split("/")
        : "<complex:" + thing.toString() + ">";
    }
  }

  console.log("\n\x1b[1m%s\x1b[0m", "AVAILABLE ROUTES");
  console.log("------------------------------------------------------------");
  app._router.stack.forEach(print.bind(null, []));
  console.log("------------------------------------------------------------");
}
