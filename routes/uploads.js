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

// Execute the addition of a new newsletter.
router.post("/insert2/Newsletter", function (req, res, next) {
    uploader.insertNewNewsletter(req, res);
});

// Execute the deletion of a newsletter.
router.post("/deletefrom/Newsletter", function (req, res, next) {
    uploader.deleteNewsletter(req, res);
});

// Execute the addition of a new "other" document.
router.post("/insert2/OtherDocument", function (req, res, next) {
    uploader.insertNewOtherDocument(req, res);
});

// Execute the deletion of an "other" document.
router.post("/deletefrom/OtherDocument", function (req, res, next) {
    uploader.deleteOtherDocument(req, res);
});

module.exports = router;
