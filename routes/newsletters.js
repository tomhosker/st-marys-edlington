/*
Routes the admin pages.
*/

// Imports.
const express = require("express");

// Local imports.
const Scraper = require("../lib/scraper.js");

// Constant objects.
const scraper = new Scraper();

// Constants.
const router = express.Router();

// GET home page.
router.get("/", function (req, res, next) {
    scraper.scrapeNewsletters(req, res);
});

module.exports = router;
