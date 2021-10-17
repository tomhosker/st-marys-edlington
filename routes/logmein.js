/*
Returns the various pages to do with the process of logging in.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");

// Constants.
const router = express.Router();
const finaliser = new Finaliser();

// Return the login page.
router.get("/", function (req, res, next) {
    console.log(req.user);
    finaliser.protoRender(req, res, "logmein", { title: "Log In" });
});

// Return the page telling the user that he logged in successfully.
router.get("/success", function (req, res, next) {
    if (req.user) {
        finaliser.protoRender(req, res, "loginsuccess", {
            title: "Success",
            username: req.user.username,
        });
    } else {
        res.redirect("/login");
    }
});

// Redirect the user to the login page, with a message saying that his
// previous attempt failed.
router.get("/failure", function (req, res, next) {
    finaliser.protoRender(req, res, "logmein", {
        title: "Success",
        previousFailure: true,
    });
});

module.exports = router;
