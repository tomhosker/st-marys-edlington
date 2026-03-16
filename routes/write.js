/*
This code routes requests to amend the database.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");
const {getWriter} = require("../lib/writer.js");

// Constants.
const router = express.Router();
const writer = getWriter();
const finaliser = new Finaliser();

module.exports = router;
