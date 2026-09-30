/*
Returns the home page.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");
const ChildrensLiturgiesORM = require("../lib/orm/childrens_liturgies_orm.js");

// Constants.
const router = express.Router();
const finaliser = new Finaliser();

// GET home page.
router.get("/childrens-liturgies", async (req, res, next) => {
    const orm = new ChildrensLiturgiesORM();

    try {
        const data = await orm.gatherDataAsync();
        await finaliser.protoRender(req, res, "childrens-liturgies", {
            title: "Children's Liturgies",
            data
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
