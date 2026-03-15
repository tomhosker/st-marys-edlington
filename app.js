// Imports.
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const favicon = require("express-favicon");
const dotenv = require("dotenv").config();

// Local imports.
const indexRouter = require("./routes/index");

// Error codes.
const notFound = 404;
const internalServerError = 500;

// Let's get cracking.
const app = express();

// "View" engine setup.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
if (app.get("env") === "development") app.locals.pretty = true;
// Un-commenting the following makes the HTML output human-readable in all
// cases. (Useful when debugging a non-local server.)
app.locals.pretty = true;

// Use application-level middleware for common functionality, including
// parsing and session handling.
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
    require("express-session")({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false
    })
);

// Initialise some other resources.
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(__dirname + "/public/favicon.ico"));

// ROUTES.
app.use("/", indexRouter);

// Catch 404 and forward to error handler.
app.use(function (req, res, next) {
    next(createError(notFound));
});

// Error handler.
app.use(function (err, req, res, next) {
    // Set locals, only providing error in development.
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // Render the error page.
    res.status(err.status || internalServerError);
    res.render("error");
});

// Listen, and tell the programmer where to find the website.
app.listen(app.get("port"), function () {
    console.log("App running at port number: " + app.get("port"));
    console.log(
        "If running locally, navigate to: http://localhost:" +
        app.get("port") +
        "/"
    );
});

// Exports.
module.exports = app;
