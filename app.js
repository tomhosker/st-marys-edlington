/**************************
 ** SET UP LOG IN SYSTEM **
 *************************/

// Login imports.
const crypto = require("crypto");
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
// Login local imports.
const signingin = require("./lib/signingin");

// Configure the local strategy for use by Passport.
passport.use(new Strategy(signingin.strategyFunc));
// Configure Passport authenticated session persistence.
passport.serializeUser(signingin.serializer);
passport.deserializeUser(signingin.deserializer);

/****************************
 ** SET UP EVERYTHING ELSE **
 ***************************/

// Imports.
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const favicon = require("express-favicon");
const dotenv = require("dotenv").config();

// Local imports.
const Finaliser = require("./lib/finaliser.js");
// Routers.
const indexRouter = require("./routes/index");
const loginRouter = require("./routes/logmein");
const stillsRouter = require("./routes/stills");
const profileRouter = require("./routes/profile");
const asIsRouter = require("./routes/asis");
const uploadsRouter = require("./routes/uploads");
const adminRouter = require("./routes/admin");
const newslettersRouter = require("./routes/newsletters");
const webmasterRouter = require("./routes/webmaster");
const youthRouter = require("./routes/youth");
const pilgrimagesRouter = require("./routes/pilgrimages");
const otherDocsRouter = require("./routes/other_documents");

// Error codes.
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

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
        saveUninitialized: false,
    })
);

// Initialise Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Initialise some other resources.
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(__dirname + "/public/favicon.ico"));

// ROUTES.
app.use("/", indexRouter);
app.use("/logmein", loginRouter);
app.use("/newsletters", newslettersRouter);
app.use("/stills", stillsRouter);
app.use("/webmaster", webmasterRouter);
app.use("/youth", youthRouter);
app.use("/pilgrimages", pilgrimagesRouter);
app.use("/other-documents", otherDocsRouter);
app.use(
    "/profile",
    require("connect-ensure-login").ensureLoggedIn(),
    profileRouter
);
app.use("/asis", require("connect-ensure-login").ensureLoggedIn(), asIsRouter);
app.use(
    "/uploads",
    require("connect-ensure-login").ensureLoggedIn(),
    uploadsRouter
);
app.get("/login", function (req, res) {
    res.redirect("/logmein");
});
app.use(
    "/admin",
    require("connect-ensure-login").ensureLoggedIn(),
    adminRouter
);
app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/logmein/failure" }),
    function (req, res) {
        res.redirect("/logmein/success");
    }
);
app.get("/logout", function (req, res) {
    req.logout(function(err) {
        if (err) return next(err);
        res.redirect("/");
    });
});

// Catch 404 and forward to error handler.
app.use(function (req, res, next) {
    const finaliser = new Finaliser();

    finaliser.finalise(req, res, "notfound", { title: "Not Found" });
});

// Error handler.
app.use(function (err, req, res, next) {
    // Set locals, only providing error in development.
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // Render the error page.
    res.status(err.status || INTERNAL_SERVER_ERROR);
    res.render("error");
});

// Tell the user where to find the website.
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
