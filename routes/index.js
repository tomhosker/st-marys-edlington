/*
Returns the home page.
*/

// Imports.
const express = require("express");

// Local imports.
const ORM = require("../lib/orm.js");

// Constants.
const router = express.Router();

// GET home page.
router.get("/", function (req, res, next) {
    let orm = new ORM(req, res);

    orm.getIndex();
});

module.exports = router;
