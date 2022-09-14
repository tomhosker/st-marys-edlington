/*
Returns the pilgrimages page.
*/

// Imports.
const express = require("express");

// Local imports.
const ORM = require("../lib/orm.js");

// Constants.
const router = express.Router();

// GET home page.
router.get("/", function (req, res, next) {
    const orm = new ORM(req, res);

    orm.getPilgrimages(req, res);
});

module.exports = router;
