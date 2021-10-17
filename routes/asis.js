/*
Returns a table from the database, pretty much as is.
*/

// Imports.
const express = require("express");

// Local imports.
const Scraper = require("../lib/scraper.js");
const Finaliser = require("../lib/finaliser.js");

// Constants.
const router = express.Router();
const scraper = new Scraper();
const finaliser = new Finaliser();

// Get a list of all viewable tables.
router.get("/", function (req, res, next) {
    finaliser.protoRender(req, res, "rawtables", { title: "List of Tables" });
});

// Return the page for a given table.
router.get("/:id", function (req, res, next) {
    scraper.fetchAsIs(req, res);
});

module.exports = router;
