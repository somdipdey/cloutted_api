"use strict";

// packages
const mongoose = require("mongoose");

// router init
const router = require("express").Router();

// models
const Hashtags = require("../../models/Hashtags");

/*
@route: GET /v1/hashtags/
@desc: get all hashtags
@access: PUBLIC
*/

router.get("/", async (req, res) => {
  const { searchTerm, searchLimit, Username } = req.query;

  const docCount = await getNumberHashtags();

  // if (!searchTerm)
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "searchTerm is required" });
  const limit = parseInt(searchLimit) || 300;
  const query = {};
  if (searchTerm)
    query["hashtag"] = { $regex: `^${searchTerm}`, $options: "i" };
  if (!!Username) {
    query["post.owner.Username"] = Username;
    delete query.hashtag;
  }

  const sort = { "post.TimestampNanos": -1 };

  findHashtags(query, { limit, sort }, (err, hashtags) => {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
    res.status(200).json({
      success: true,
      message: "Successfully fetched hashtags",
      dataLength: hashtags.length,
      totalHashtags: docCount,
      hashtags,
    });
  });
});

/*
@route: POST /v1/hashtags/
@desc: post communities to db
@access: PUBLIC
*/
router.post("/", (req, res) => {
  res.status(200).json("Route not implemented");
});

module.exports = router;
