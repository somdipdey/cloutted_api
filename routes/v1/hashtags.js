"use strict";

// packages
const mongoose = require("mongoose");

// router init
const router = require("express").Router();

/*
@route: GET /v1/hashtags/
@desc: get all hashtags
@access: PUBLIC
*/
router.get("/", (req, res) => {
  res.status(200).json("sending all json");
});

/*
@route: POST /v1/hashtags/
@desc: post hashtags to db
@access: PUBLIC
*/
router.post("/", (req, res) => {
  res.status(200).json("got hashtags to add to db");
});

module.exports = router;
