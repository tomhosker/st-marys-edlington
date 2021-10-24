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

// Execute the addition of a new service time.
router.post("/insert2/ServiceTime", function (req, res, next) {
    uploader.insertNewServiceTime(req, res);
});

// Execute the deletion of a service time.
router.post("/deletefrom/ServiceTime", function (req, res, next) {
    uploader.deleteServiceTime(req, res);
});

module.exports = router;
