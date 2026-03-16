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
router.get("/", (req, res) => {
    finaliser.protoRender(req, res, "logmein", { title: "Log In" });
});

// Return the page telling the user that he logged in successfully.
router.get("/success", (req, res) => {
    let properties;

    if (req.isAuthenticated()) {
        properties = {title: "Success", username: req.user.username};
        finaliser.protoRender(req, res, "loginsuccess", properties);
    }
    else res.redirect("/login");
});

// Redirect the user to the login page, with a message saying that his
// previous attempt failed.
router.get("/failure", (req, res) => {
    const properties = {title: "Log In", previousFailure: true};

    finaliser.protoRender(req, res, "logmein", properties);
});

module.exports = router;
