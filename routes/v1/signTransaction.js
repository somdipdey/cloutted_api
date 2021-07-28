"use strict";

// packages
const mongoose = require("mongoose");

// router init
const router = require("express").Router();

// models
const Post = require("../../models/Post");

//
const path = require("path");

/*
@route: GET /v1/signTransaction
@desc: get signed transaction
@access: PUBLIC
*/

const { PythonShell } = require("python-shell");

router.get("/", async (req, res) => {
  const payload = req.query;
  const { transHex, seedHex } = payload;

  let options = {
    mode: "text",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: path.join(__dirname, "../../python-scripts/sign-transaction/"), //If you are having python_test.py script in same folder, then it's optional.
    args: [transHex, seedHex], //An argument which can be accessed in the script using sys.argv[1]
  };

  PythonShell.run("sign-transaction.py", options, function (err, result) {
    if (err)
      return res.json({
        success: false,
        message: "Something went wrong. Please try again later",
      });

    return res.json({
      success: true,
      message: "Signed your transactions",
      signedTransaction: result.toString(),
    });
  });
});

module.exports = router;
