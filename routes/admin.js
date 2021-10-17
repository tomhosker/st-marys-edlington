/*
Routes the admin pages.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");

// Constant objects.
const finaliser = new Finaliser();

// Constants.
const router = express.Router();

// GET home page.
router.get("/", function (req, res, next) {
    finaliser.protoRender(req, res, "admin", { title: "Admin Area" });
});

module.exports = router;
