/*
Amend the database.
*/

// Imports.
const express = require("express");

// Local imports.
const Uploader = require("../lib/uploader.js");

// Constants.
const router = express.Router();
const uploader = new Uploader();

// Execute an upload to the JournalEntry table.
router.post("/insert2/ServiceTime", function (req, res, next) {
    uploader.insertNewServiceTime(req, res, "ServiceTime");
});

module.exports = router;
