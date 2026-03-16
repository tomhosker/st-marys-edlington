/*
Returns the home page.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");
const YouthORM = require("../lib/orm/youth_orm.js");

// Constants.
const router = express.Router();
const finaliser = new Finaliser();

// GET home page.
router.get("/", (req, res) => {
    const orm = new YouthORM();
    let properties;

    orm.gatherDataAsync().then((data) => {
        properties = {
            title: "Youth",
            data: data
        };

        finaliser.protoRender(req, res, "youth", properties);
    });
});

module.exports = router;
