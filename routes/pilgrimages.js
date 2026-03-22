/*
Returns the pilgrimages page.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");
const PilgrimagesORM = require("../lib/orm/pilgrimages_orm.js");

// Constants.
const router = express.Router();
const finaliser = new Finaliser();

// GET home page.
router.get("/", (req, res) => {
    const orm = new PilgrimagesORM();
    let properties;

    orm.gatherDataAsync().then((data) => {
        properties = {
            title: "Pilgrimages",
            data: data
        };

        finaliser.protoRender(req, res, "pilgrimages", properties);
    });
});

module.exports = router;