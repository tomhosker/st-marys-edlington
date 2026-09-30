/************************
 * SET UP LOG IN SYSTEM *
 ***********************/

// Login imports.
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const connectEnsureLogIn = require("connect-ensure-login");
// Login local imports.
const signingin = require("./lib/signingin");

// Configure the local strategy for use by Passport.
passport.use(new Strategy(signingin.strategyFunc));
// Configure Passport authenticated session persistence.
passport.serializeUser(signingin.serializer);
passport.deserializeUser(signingin.deserializer);

/**************************
 * SET UP EVERYTHING ELSE *
 *************************/

// Imports.
const express = require("express");
const path = require("path");
const logger = require("morgan");
const favicon = require("express-favicon");
require("dotenv").config();

// Local imports.
const Finaliser = require("./lib/finaliser.js");
const { smartApostrophes } = require("./lib/utils.js");
const indexRouter = require("./routes/index.js");
const loginRouter = require("./routes/logmein.js");
const profileRouter = require("./routes/profile.js");
const asIsRouter = require("./routes/asis.js");
const writeRouter = require("./routes/write.js");
const adminRouter = require("./routes/admin.js");
const youthRouter = require("./routes/youth.js");
const pilgrimagesRouter = require("./routes/pilgrimages.js");

// Error codes.
const INTERNAL_SERVER_ERROR = 500;
const NOT_FOUND = 404;

// Let's get cracking.
const app = express();
app.locals.smartApostrophes = smartApostrophes;

// "View" engine setup.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
if (app.get("env") === "development") app.locals.pretty = true;
// Un-commenting the following makes the HTML output human-readable in all
// cases. (Useful when debugging a non-local server.)
app.locals.pretty = true;

// Use application-level middleware for common functionality, including
// parsing and session handling.
const isProduction = app.get("env") === "production";
const sessionSecret = process.env.SESSION_SECRET;

if (isProduction && !sessionSecret) {
    throw new Error("SESSION_SECRET must be set in production.");
}

if (isProduction) app.set("trust proxy", 1);

app.use(
    require("express-session")({
        secret: sessionSecret || "local-development-only",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: isProduction
        }
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
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(__dirname + "/public/favicon.ico"));

// ROUTES.
app.use("/", indexRouter);
app.use("/logmein", loginRouter);
app.use("/youth", youthRouter);
app.use("/pilgrimages", pilgrimagesRouter);
// Protected routes.
app.use("/profile", connectEnsureLogIn.ensureLoggedIn(), profileRouter);
app.use("/asis", connectEnsureLogIn.ensureLoggedIn(), asIsRouter);
app.use("/write", connectEnsureLogIn.ensureLoggedIn(), writeRouter);
app.get("/login", (_, res) => res.redirect("/logmein"));
app.use("/admin", connectEnsureLogIn.ensureLoggedIn(), adminRouter);
app.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/logmein/failure",
        successRedirect: "/logmein/success"
    })
);
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

// Catch 404 and forward to error handler.
app.use(async (req, res, next) => {
    const finaliser = new Finaliser();

    try {
        res.status(NOT_FOUND);
        await finaliser.protoRender(req, res, "notfound", {
            title: "Not Found"
        });
    } catch (error) {
        next(error);
    }
});

// Error handler.
app.use((err, req, res, next) => {
    // Set locals, only providing error in development.
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // Render the error page.
    res.status(err.status || INTERNAL_SERVER_ERROR);
    res.render("error");
});

// Exports.
module.exports = app;
