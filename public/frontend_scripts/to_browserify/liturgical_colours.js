/*
This is a front end script which changes the colours of elements according to
the current liturgical colour.
*/

// Imports.
const RomCal = require("romcal");

// A helper function.
function recolorElements(className, field, color) {
    const elements = document.querySelectorAll("." + className);

    elements.forEach((element) => {
        element.style[field] = color;
    });
}

// A helper function.
function convertRawColor(rawColor) {
    if (rawColor === "RED") return "red";
    else if (rawColor === "ROSE") return "deeppink";
    else if (rawColor === "PURPLE") return "purple";
    else if (rawColor === "GREEN") return "green";
    else if (rawColor === "WHITE") return "gold";
    else if (rawColor === "GOLD") return "gold";

    throw new Error("Unrecognised liturgical color: " + rawColor);
}

// The class in question.
class ColorChanger {
    constructor() {
        this.litColor = "gold";
        this.liturgicalColor = this.getLiturgicalColor();
    }

    getLiturgicalColor() {
        const calendar = RomCal.calendarFor();
        const today = new Date();
        const todayAtMidnight = new Date(
            Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
        );
        const moment = todayAtMidnight.toISOString();
        let result;

        for (let i = 0; i < calendar.length; i++) {
            if (calendar[i].moment === moment) {
                result = convertRawColor(
                    calendar[i].data.meta.liturgicalColor.key
                );
                return result;
            }
        }

        throw new Error("No matching color found.");
    }

    recolorElements(className, field) {
        const elements = document.querySelectorAll("." + className);

        elements.forEach((element) => {
            element.style[field] = this.liturgicalColor;
        });
    }

    recolor() {
        this.recolorElements("liturgical-background", "background-color");
        this.recolorElements("liturgical-border", "border-color");
    }
}

// Let's get cracking...
const colorChanger = new ColorChanger();
colorChanger.recolor();
