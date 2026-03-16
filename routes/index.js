/*
Returns the home page.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");
const IndexORM = require("../lib/orm/index_orm.js");

// Constants.
const router = express.Router();
const finaliser = new Finaliser();

// GET home page.
router.get("/", (req, res) => {
    const orm = new IndexORM();
    let properties;

    orm.gatherDataAsync().then((data) => {
        properties = {
            title: "Welcome",
            data: data
        };

        finaliser.protoRender(req, res, "index", properties);
    });
});

module.exports = router;
