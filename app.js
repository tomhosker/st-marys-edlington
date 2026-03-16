/************************
 * SET UP LOG IN SYSTEM *
 ***********************/

// Login imports.
const crypto = require("crypto");
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
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const favicon = require("express-favicon");
const dotenv = require("dotenv").config();

// Local imports.
const Finaliser = require("./lib/finaliser.js");
const indexRouter = require("./routes/index.js");
const loginRouter = require("./routes/logmein.js");
const profileRouter = require("./routes/profile.js");
const asIsRouter = require("./routes/asis.js");
const writeRouter = require("./routes/write.js");
const adminRouter = require("./routes/admin.js");
const youthRouter = require("./routes/youth.js");

// Error codes.
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
        saveUninitialized: false
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
app.use("/youth", youthRouter);
// Protected routes.
app.use("/profile", connectEnsureLogIn.ensureLoggedIn(), profileRouter);
app.use("/asis", connectEnsureLogIn.ensureLoggedIn(), asIsRouter);
app.use("/write", connectEnsureLogIn.ensureLoggedIn(), writeRouter);
app.get("/login", (_, res) => res.redirect("/logmein"));
app.use("/admin", connectEnsureLogIn.ensureLoggedIn(), adminRouter);
app.post(
    "/login",
    passport.authenticate(
        "local",
        {
            failureRedirect: "/logmein/failure",
            successRedirect: "/logmein/success"
        }
    )
);
app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

// Catch 404 and forward to error handler.
app.use((req, res, next) => {
    const finaliser = new Finaliser();

    finaliser.protoRender(req, res, "notfound", { title: "Not Found" });
});

// Error handler.
app.use((err, req, res) => {
    // Set locals, only providing error in development.
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // Render the error page.
    res.status(err.status || INTERNAL_SERVER_ERROR);
    res.render("error");
});

// Listen, and tell the programmer where to find the website.
app.listen(app.get("port"), () => {
    console.log("App running at port number: " + app.get("port"));
    console.log(
        "If running locally, navigate to: http://localhost:" +
        app.get("port") +
        "/"
    );
});

// Exports.
module.exports = app;
