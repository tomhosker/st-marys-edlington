/*
Routes the admin pages.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");
const ORM = require("../lib/orm.js");

// Constant objects.
const finaliser = new Finaliser();

// Constants.
const router = express.Router();

// GET home page.
router.get("/", function (req, res, next) {
    finaliser.protoRender(req, res, "admin", { title: "Admin Area" });
});

// Add records to the database.
router.get("/add/:id", function (req, res, next) {
    const action = "/uploads/insert2/" + req.params.id;
    const orm = new ORM(req, res);
    let properties;

    if (req.params.id === "ServiceTime") {
        properties = {
            title: "Add a New Service Time",
            formAction: action,
        };
        orm.getUpload2ServiceTime(properties);
    } else if (req.params.id === "Newsletter") {
        properties = {
            title: "Add a New Newsletter",
            formAction: action,
        };
        finaliser.protoRender(req, res, "upload2Newsletter", properties);
    } else if (req.params.id === "OtherDocument") {
        properties = {
            title: "Add a New ``Other'' Document",
            formAction: action,
        };
        finaliser.protoRender(req, res, "upload2OtherDocument", properties);
    } else res.redirect("/");
});

// Remove records from the database.
router.get("/remove/:id", function (req, res, next) {
    const action = "/uploads/deletefrom/" + req.params.id;
    const orm = new ORM(req, res);

    if (req.params.id === "ServiceTime") {
        orm.getDeleteFromServiceTime(action);
    } else if (req.params.id === "Newsletter") {
        orm.getDeleteFromNewsletter(action);
    } else if (req.params.id === "OtherDocument") {
        orm.getDeleteFromOtherDocument(action);
    } else res.redirect("/");
});

module.exports = router;
