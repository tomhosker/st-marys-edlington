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
router.get("/", async (req, res, next) => {
    try {
        await finaliser.protoRender(req, res, "logmein", { title: "Log In" });
    } catch (error) {
        next(error);
    }
});

// Return the page telling the user that he logged in successfully.
router.get("/success", async (req, res, next) => {
    let properties;

    if (req.isAuthenticated()) {
        properties = { title: "Success", username: req.user.username };
        try {
            await finaliser.protoRender(req, res, "loginsuccess", properties);
        } catch (error) {
            next(error);
        }
    } else res.redirect("/login");
});

// Redirect the user to the login page, with a message saying that his
// previous attempt failed.
router.get("/failure", async (req, res, next) => {
    const properties = { title: "Log In", previousFailure: true };

    try {
        await finaliser.protoRender(req, res, "logmein", properties);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
