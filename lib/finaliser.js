/*
This code contains a class which handles any final, universal touches to the
page before it's passed to the browser.
*/

// The class in question.
class Finaliser {
    constructor() {}

    // Ronseal.
    static fixApostrophes(input) {
        while (input.indexOf("``") >= 0) {
            input = input.replace("``", "&ldquo;");
        }
        while (input.indexOf("''") >= 0) {
            input = input.replace("''", "&rdquo;");
        }
        while (input.indexOf("`") >= 0) {
            input = input.replace("`", "&lsquo;");
        }
        while (input.indexOf("'") >= 0) {
            input = input.replace("'", "&rsquo;");
        }
        return input;
    }

    // Gives either a log in or a log out link, as appropriate.
    static getLogInOrOut(req) {
        let result;

        if (req.user) result = '<a href="/logout">Log out</a>';
        else result = '<a href="/login">Log in</a>';

        return result;
    }

    // Render, and deliver the page to the browser.
    protoRender(req, res, view, properties) {
        const date = new Date();

        properties.footstamp = date.toISOString();
        properties.logInOrOut = Finaliser.getLogInOrOut(req);

        res.render(view, properties, function (err, html) {
            if (html) {
                html = Finaliser.fixApostrophes(html);
                res.send(html);
            } else {
                res.render(view, properties);
            }
        });
    }
}

// Exports.
module.exports = Finaliser;
