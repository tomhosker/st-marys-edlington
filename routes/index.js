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
router.get("/", async (req, res, next) => {
    const orm = new IndexORM();

    try {
        const data = await orm.gatherDataAsync();
        await finaliser.protoRender(req, res, "index", {
            title: "Welcome",
            data
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
