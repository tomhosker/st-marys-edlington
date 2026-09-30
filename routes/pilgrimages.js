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
router.get("/", async (req, res, next) => {
    const orm = new PilgrimagesORM();

    try {
        const data = await orm.gatherDataAsync();
        await finaliser.protoRender(req, res, "pilgrimages", {
            title: "Pilgrimages",
            data
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
