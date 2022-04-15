/*
Routes the admin pages.
*/

// Imports.
const express = require("express");

// Local imports.
const ORM = require("../lib/orm.js");

// Constant objects.
const orm = new ORM();

// Constants.
const router = express.Router();

// GET home page.
router.get("/", function (req, res, next) {
    orm.getNewsletters(req, res);
});

module.exports = router;
