/*
Returns the 404 error page.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");

// Constant global objects.
const router = express.Router();
const finaliser = new Finaliser();

// GET the 404 page.
router.get("/", function (req, res, next) {
    finaliser.protoRender(req, res, "notfound", { title: "Not Found" });
});

module.exports = router;
