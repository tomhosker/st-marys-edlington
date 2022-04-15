/*
Returns the "Youth" page(s).
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");

// Constants.
const router = express.Router();
const finaliser = new Finaliser();

// GET the root page.
router.get("/", function (req, res, next) {
    finaliser.protoRender(req, res, "youth", { title: "Youth" });
});

module.exports = router;
