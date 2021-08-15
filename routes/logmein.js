/*
Returns the various pages to do with the process of logging in.
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

// Return the page telling the user that they logged in successfully.
router.get("/success", function(req, res, next){
    finaliser.protoRender(
        req, res, "loginsuccess", { title: "Success" });
});

// Return the login page.
router.get("/", function(req, res, next){
    finaliser.protoRender(req, res, "logmein", { title: "Log In" });
});

module.exports = router;
