/*
Routes the admin pages.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");

// Constant objects.
const finaliser = new Finaliser();
const router = express.Router();

// GET the admin area page.
router.get("/", async (req, res, next) => {
    try {
        await finaliser.protoRender(req, res, "admin", { title: "Admin Area" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
