/*
Routes the admin pages.
*/

// Imports.
const express = require("express");

// Local imports.

// Constants.
const router = express.Router();

// GET home page.
router.get("/", function (req, res, next) {
    finaliser.protoRender(req, res, code, { title: "Admin Area" });
});

module.exports = router;
