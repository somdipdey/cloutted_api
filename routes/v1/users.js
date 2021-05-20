"use strict";

// packages
const mongoose = require("mongoose");
const { default: axios } = require("axios").default;

const request = require("request");

// router init
const router = require("express").Router();

// config
const bitclout_config = require("../../config/bitclout");

// models
const Post = require("../../models/Post");

// helpers
const getHashTags = require("../../helpers/getHashTags");

/*
@route: GET /v1/users/
@desc: get all posts
@access: PUBLIC
*/

router.get("/", (req, res) => {
  try {
    const { Username: UsernamePrefix } = req.query;

    if (!UsernamePrefix)
      return res.json({
        success: true,
        message: "fetched result for empty username",
        users: [],
      });

    const FetchUsersThatHODL = false;
    const AddGlobalFeedBool = false;

    const body = {
      UsernamePrefix,
      FetchUsersThatHODL,
      AddGlobalFeedBool,
    };

    const url = bitclout_config.genUrl(bitclout_config.endPoints.getProfiles);

    const options = {
      url,
      method: "POST",
      headers: bitclout_config.defaultHeaders,
      body,
    };

    const callback = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log(JSON.parse(body));
      }
    };

    // return;

    request(options, callback);

    // get all users
    return res.json({
      success: true,
      message: "user names of all the users in db",
      users: "dara bara",
    });
  } catch (err) {
    console.log(err);
  }
});

/*
@route: GET /v1/users/get-user/
@desc: get all posts
@access: PUBLIC
*/
router.get("/get-user", async (req, res) => {
  try {
    const { PublicKeyBase58Check } = req.query;

    if (!PublicKeyBase58Check)
      return res.status(400).json({
        success: false,
        message: "PublicKeyBase58Check is required",
      });

    const NumToFetch = 1;

    const dataString = {
      PublicKeyBase58Check,
      NumToFetch,
    };

    const url = bitclout_config.genUrl(bitclout_config.endPoints.getProfiles);

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
        const user = ProfilesFound[0];
        if (user) {
          delete user.Posts;
          return res.json({
            success: true,
            message: "Successfully fetched user profile",
            user,
          });
        }
        res.status(400).json({
          success: false,
          message:
            "Could not found profile with the provided PublicKeyBase58Check",
        });
      }
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Could not found profile with the provided PublicKeyBase58Check",
    });
  }
});

module.exports = router;
