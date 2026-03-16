/*
This code handles a request to view the profile of the current user.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");

// Constants.
const router = express.Router();
const finaliser = new Finaliser();

// Return the home page.
router.get("/", (req, res) => {
    const theTitle = `User: ${req.user.username}`;

    finaliser.protoRender(req, res, "profile", {
        title: theTitle,
        user: req.user,
    });
});

// Exports.
module.exports = router;
