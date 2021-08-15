/*
Returns the home page.
*/

console.log(require.paths);

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");

// Constants.
const router = express.Router();
const finaliser = new Finaliser();

// GET home page.
router.get("/", function(req, res, next){
    finaliser.protoRender(req, res, "index", { title: "Welcome" });
});

module.exports = router;
