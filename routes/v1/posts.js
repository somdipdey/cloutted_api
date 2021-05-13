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
  const payload = req.body;

  const { numToFetch } = payload;

  let PublicKeyBase58Check = req.query.PublicKeyBase58Check;
  const username = req.query.username;

  if (!PublicKeyBase58Check) {
    if (!username)
      res.status(400).json({
        success: false,
        message: "Either username or PublicKeyBase58Check is required",
      });

    const PublicKeyBase58Check = "";
    const Username = "";
    const UsernamePrefix = username;
    const NumToFetch = numToFetch || 300;
    const ReaderPublicKeyBase58Check = "";

    const dataString = {
      PublicKeyBase58Check,
      NumToFetch,
      Username,
      UsernamePrefix,
      ReaderPublicKeyBase58Check,
    };

    const url = bitclout_config.genUrl(bitclout_config.endPoints.getProfiles);

    const reponse = await axios({
      method: "POST",
      url,
      headers: bitclout_config.defaultHeaders,
      data: dataString,
    });

    if (response.status != 200)
      res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again",
      });

    if (reponse.status == 200) {
      const { data } = reponse;

      const { ProfilesFound } = data;

      if (ProfilesFound) {
        if (ProfilesFound.length > 1)
          res.status(400).json({
            success: false,
            message: "Exact match to username is not found",
          });

        PublicKeyBase58Check = ProfilesFound[0].PublicKeyBase58Check;
      }
    }
  }

  const url = bitclout_config.genUrl(
    bitclout_config.endPoints.getPostForPubKey
  );

  let dataString = {
    PublicKeyBase58Check,
    Username: "",
    NumToFetch: 300,
  };

  axios({
    method: "POST",
    url,
    headers: bitclout_config.defaultHeaders,
    data: dataString,
  })
    .then(({ data: { Posts: posts } }) => {
      posts.forEach(async (post) => {
        const isExists = await postDoesExist(post.PostHashHex);
        if (!isExists) {
          post = { ...post, PublicKeyBase58Check, Username };
          addPost(post);
          const hashTags = getHashTags(post.Body);
          hashTags.forEach((hashtag) => {
            const hashtagObj = { hashtag, PostHashHex: post.PostHashHex, post };
            addHashTag(hashtagObj);
            insertHashtagTrend(hashtag);

            // finding and sending posts

            const limit = 100;
            findPosts({ PublicKeyBase58Check }, { limit }, (err, posts) => {
              if (err) {
                console.log(err);
                res
                  .status(500)
                  .json({ success: false, message: "Something went wrong" });
              }
              res.status(200).json({
                success: true,
                message: "Successfully fetched posts",
                dataLength: limit,
                posts,
              });
            });
          });
        }
      });

      res.status(200).json();
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
