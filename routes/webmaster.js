/*
Returns a page giving the webmaster's details.
*/

// Imports.
const express = require("express");

// Local imports.
const Scraper = require("../lib/scraper.js");

// Constants.
const router = express.Router();
const scraper = new Scraper();

// GET home page.
router.get("/", function (req, res, next) {
    scraper.scrapeWebmaster(req, res);
});

module.exports = router;
