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
@route: GET /v1/users/get-user/
@desc: get all posts
@access: PUBLIC
*/
router.get("/get-user", async (req, res) => {
  try {
    const payload = req.query;

    const { PublicKeyBase58Check } = payload;

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
