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
router.get("/", (req, res) => {
    finaliser.protoRender(req, res, "admin", {title: "Admin Area"});
});

module.exports = router;
