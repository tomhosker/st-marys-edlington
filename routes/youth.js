/*
Returns the "Youth" page(s).
*/

// Imports.
const express = require("express");

// Local imports.
const ORM = require("../lib/orm.js");

// Constants.
const router = express.Router();
const orm = new ORM();

// GET home page.
router.get("/", function (req, res, next) {
    orm.getYouth(req, res);
});

module.exports = router;
