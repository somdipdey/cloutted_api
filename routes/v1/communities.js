"use strict";

// packages
const mongoose = require("mongoose");

// router init
const router = require("express").Router();

// models
const Post = require("../../models/Post");

/*
@route: GET /v1/communities/
@desc: get all communities
@access: PUBLIC
*/
router.get("/", (req, res) => {
  const payload = req.query;
  const limit = 300;
  findPosts({}, { limit }, (err, posts) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json({
      success: true,
      message: "Successfully fetched posts",
      dataLength: limit,
      posts,
    });
  });
});

/*
@route: POST /v1/communities/
@desc: post communities to db
@access: PUBLIC
*/
router.post("/", (req, res) => {
  res.status(200).json("got communities to add to db");
});

module.exports = router;
