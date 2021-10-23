/*
Routes the admin pages.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");

// Constant objects.
const finaliser = new Finaliser();
const scraper = new Scraper();

// Constants.
const router = express.Router();

// GET home page.
router.get("/", function (req, res, next) {
    finaliser.protoRender(req, res, "admin", { title: "Admin Area" });
});

// Amend the database.
router.get("/upload/:id", function (req, res, next) {
    let properties;
    let action = "/uploads/insert2/"+req.params.id;

    if (req.params.id === "ServiceTime") {
        properties = {
            title: "Add a New Service Time",
            formAction: action
        };
        scraper.scrapeUpload2ServiceTime(req, res, properties);
    } else {
        res.redirect("/");
    }
});

module.exports = router;
