"use strict";

// packages
const mongoose = require("mongoose");

// router init
const router = require("express").Router();

// models
const Post = require("../../models/Post");

// path module
const path = require("path");

// url configs
const { genUrl, endPoints } = require("../../config/bitclout");

// axios client
const { default: axios } = require("axios");

/*
@route: GET /v1/signTransaction
@desc: get signed transaction
@access: PUBLIC
*/

const bitcloutHeaders = {
  authority: "bitclout.com",
  accept: "application/json, text/plain, */*",
  "sec-ch-ua-mobile": "?1",
  "user-agent":
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36",
  "content-type": "application/json",
  origin: "https://bitclout.com",
  "sec-fetch-site": "same-origin",
  "sec-fetch-mode": "cors",
  "sec-fetch-dest": "empty",
  "accept-language": "en-US,en;q=0.9",
};

const { PythonShell } = require("python-shell");

router.get("/", async (req, res) => {
  const payload = req.query;
  const { ReaderPublicKeyBase58Check, LikedPostHashHex, IsUnlike, seedHex } =
    payload;

  const MinFeeRateNanosPerKB = 1000;

  const headers = { "content-type": "application/json" };

  const createLikeUrl = genUrl(endPoints.createLike);

  const createLikeData = {
    ReaderPublicKeyBase58Check,
    LikedPostHashHex,
    IsUnlike: JSON.parse(IsUnlike),
    MinFeeRateNanosPerKB,
  };

  const {
    data: { TransactionHex },
  } = await axios
    .post(createLikeUrl, createLikeData, {
      headers: bitcloutHeaders,
    })
    .catch((err) =>
      res.json({ success: false, message: "Something went wrong" })
    );

  let options = {
    mode: "text",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: path.join(__dirname, "../../python-scripts/sign-transaction/"), //If you are having python_test.py script in same folder, then it's optional.
    args: [TransactionHex, seedHex], //An argument which can be accessed in the script using sys.argv[1]
  };

  PythonShell.run("sign-transaction.py", options, async (err, result) => {
    if (err)
      return res.json({
        success: false,
        message: "Something went wrong. Please try again later",
        err,
      });

    const submitTransUrl = genUrl(endPoints.submitTransaction);

    const submitTransData = {
      TransactionHex,
    };

    const submitRes = await axios
      .post(submitTransUrl, submitTransData, {
        headers: bitcloutHeaders,
      })
      .catch((err) => {
        return res.json(err);
      });

    return res.json({
      success: true,
      message: "Signed your transactions",
      signedTransaction: result.toString(),
    });
  });
});

module.exports = router;
