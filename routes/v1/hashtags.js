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
router.get("/", (req, res) => {
  const { searchTerm, searchLimit } = req.query;

  if (!searchTerm)
    return res
      .status(400)
      .json({ success: false, message: "searchTerm is required" });
  const limit = parseInt(searchLimit) || 300;
  const query = { hashtag: { $regex: searchTerm, $options: "i" } };
  findHashtags(query, { limit }, (err, hashtags) => {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
    res.status(200).json({
      success: true,
      message: "Successfully fetched hashtags",
      dataLength: limit,
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
