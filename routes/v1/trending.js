"use strict";

// packages
const mongoose = require("mongoose");
const { default: axios } = require("axios").default;

// router init
const router = require("express").Router();

// config
const bitclout_config = require("../../config/bitclout");

// models
const Hashtags = require("../../models/Hashtags");

// helpers
const getHashTags = require("../../helpers/getHashTags");

/*
@route: GET /v1/posts/
@desc: get all posts
@access: PUBLIC
*/
router.get("/", (req, res) => {
  const { offset, resLimit } = req.query;

  const timeNow = new Date().getTime();
  const startTime =
    new Date(timeNow - parseInt(offset || 960) * 60 * 60 * 1000).getTime() *
    Math.pow(10, 6);
  const endTime = timeNow * Math.pow(10, 6);

  const timeQuery = {
    "post.TimestampNanos": {
      $gte: startTime,
      $lte: endTime,
    },
  };

  const sort = {
    "post.LikeCount": -1,
  };

  const limit = parseInt(resLimit) || 100;
  findHashtags(timeQuery, { sort, limit }, (err, posts) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully fetched posts",
      dataLength: limit,
      posts,
    });
  });
});

router.get("/frequency", (req, res) => {
  const { offset, resLimit } = req.query;

  const timeNow = new Date().getTime();
  const startTime =
    new Date(timeNow - parseInt(offset || 960) * 60 * 60 * 1000).getTime() *
    Math.pow(10, 6);
  const endTime = timeNow * Math.pow(10, 6);

  const timeQuery = {
    "post.TimestampNanos": {
      $gte: startTime,
      $lte: endTime,
    },
  };

  getTrendings(timeQuery, (err, posts) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }

    if (posts) {
      posts = posts.slice(resLimit || 10);
      return res.status(200).json({
        success: true,
        message: "Successfully fetched posts",
        dataLength: resLimit,
        posts,
      });
    }

    res.json("no posts");
  });
});

module.exports = router;
