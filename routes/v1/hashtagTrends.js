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
  const payload = req.query;
  const { searchLimit, searchTerm } = payload;

  let query = {};

  if (searchTerm)
    query = { ...query, hashtag: { $regex: searchTerm, $options: "i" } };

  const limit = parseInt(searchLimit) || 10;
  const sort = { count: -1 };
  findHashtagTrends(query, { limit, sort }, (err, hashtagTrends) => {
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
@route: GET /v1/hashtagtrends/get-count
@desc: get all hashtagtrends
@access: PUBLIC
*/
router.get("/get-count", (req, res) => {
  const payload = req.query;
  const { searchTerm } = payload;

  let query = {};

  if (!searchTerm)
    return res.status(400).json({
      success: false,
      message: "searchTerm is important",
    });

  if (searchTerm) query = { ...query, hashtag: searchTerm };

  findHashtagTrends(query, {}, (err, hashtagTrends) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }

    const hashtagLength = hashtagTrends[0].count;
    return res.status(200).json({
      success: true,
      message: "Successfully fetched hashtagTrends",
      hashtagLength,
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
