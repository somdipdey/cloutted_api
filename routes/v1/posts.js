"use strict";

// packages
const mongoose = require("mongoose");
const { default: axios } = require("axios").default;

// router init
const router = require("express").Router();

// config
const bitclout_config = require("../../config/bitclout");

// models
const Post = require("../../models/Post");

// helpers
const getHashTags = require("../../helpers/getHashTags");

/*
@route: GET /v1/posts/
@desc: get all posts
@access: PUBLIC
*/
router.get("/", (req, res) => {
  const payload = req.body;
  const limit = 300;
  findPosts({}, { limit }, (err, posts) => {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Something went wrong" });
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
@route: GET /v1/posts/
@desc: get all posts
@access: PUBLIC
*/
router.get("/by-user", async (req, res) => {
  let owner;
  const payload = req.query;

  const { numToFetch } = payload;

  let PublicKeyBase58Check = req.query.PublicKeyBase58Check;
  let username = req.query.username;

  if (!PublicKeyBase58Check) {
    if (!username)
      return res.status(400).json({
        success: false,
        message: "Either username or PublicKeyBase58Check is required",
      });

    const PublicKeyBase58Check = "";
    const Username = username;
    // const UsernamePrefix = username;
    const NumToFetch = numToFetch || 1;

    const dataString = {
      PublicKeyBase58Check,
      NumToFetch,
      // Username,
    };

    const url = bitclout_config.genUrl(bitclout_config.endPoints.getProfile);

    const response = await axios({
      method: "POST",
      url,
      headers: bitclout_config.defaultHeaders,
      data: dataString,
    });

    if (response.status != 200)
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again",
      });

    if (response.status == 200) {
      const { data } = response;

      const { ProfilesFound } = data;

      if (ProfilesFound) {
        if (ProfilesFound.length > 1)
          res.status(400).json({
            success: false,
            message: "Exact match to username is not found",
          });

        owner = delete ProfilesFound[0].Posts;
      }
    }
  }

  const url = bitclout_config.genUrl(
    bitclout_config.endPoints.getPostForPubKey
  );

  let dataString = {
    PublicKeyBase58Check,
    Username: username,
    NumToFetch: 300,
  };

  axios({
    method: "POST",
    url,
    headers: bitclout_config.defaultHeaders,
    data: dataString,
  })
    .then(({ data: { Posts: posts } }) => {
      res.status(200).json({
        success: true,
        message: "Successfully fetched posts",
        dataLength: posts.length,
        posts: [...posts.map((post) => ({ ...post, owner }))],
      });

      posts.forEach(async (post) => {
        const isExists = await postDoesExist(post.PostHashHex);
        if (!isExists) {
          post = { ...post, owner };
          addPost(post);
          const hashTags = getHashTags(post.Body);
          if (!hashTags) return;
          hashTags.forEach((hashtag) => {
            const hashtagObj = { hashtag, PostHashHex: post.PostHashHex, post };
            addHashTag(hashtagObj);
            insertHashtagTrend(hashtag);
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, message: "Some error occured" });
    });
});

/*
@route: POST /v1/post/
@desc: post post to db
@access: PUBLIC
*/
router.post("/", (req, res) => {
  res.status(200).json("Route not implemented yet");
});

module.exports = router;
