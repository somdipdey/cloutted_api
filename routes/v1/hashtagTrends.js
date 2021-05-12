"use strict";

// packages
const mongoose = require("mongoose");

// router init
const router = require("express").Router();

// models
const HashtagTrends = require("../../models/HashtagTrends");

/*
@route: GET /v1/hashtagtrends/
@desc: get all hashtagtrends
@access: PUBLIC
*/
router.get("/", (req, res) => {
  const payload = req.body;
  const { searchLimit } = payload;

  const limit = searchLimit || 10;
  const sort = { count: -1 };
  findHashtagTrends({}, { limit, sort }, (err, hashtagTrends) => {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
    res.status(200).json({
      success: true,
      message: "Successfully fetched hashtagTrends",
      dataLength: limit,
      hashtagTrends,
    });
  });
});

/*
@route: POST /v1/hashtagtrends/
@desc: post hashtagtrends to db
@access: PUBLIC
*/
router.post("/", (req, res) => {
  res.status(200).json("Route not implemented");
});

module.exports = router;
