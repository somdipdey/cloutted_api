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
  const payload = req.body;
  const limit = 300;
  findHashtags({}, { limit }, (err, hashtags) => {
    if (err) {
      console.log(err);
    }
    res
      .status(200)
      .json({
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
  res.status(200).json("got hashtags to add to db");
});

module.exports = router;
