/*
Returns the home page.
*/

// Imports.
const express = require("express");

// Local imports.
const ORM = require("../lib/orm.js");

// Constants.
const router = express.Router();
const orm = new ORM();

// GET home page.
router.get("/", function (req, res, next) {
    orm.scrapeIndex(req, res);
});

module.exports = router;
