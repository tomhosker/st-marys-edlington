/*
This is a front end script which changes the colours of elements according to
the current liturgical colour.
*/

// Imports.
const RomCal = require("romcal");

// A helper function.
function recolorElements(className, field, color) {
    const elements = document.querySelectorAll("."+className);

    elements.forEach(element => { element.style[field] = color; });
}

// A helper function.
function convertRawColor(rawColor) {
    if (rawColor === RomCal.LiturgicalColors.RED) return "red";
    else if (rawColor === RomCal.LiturgicalColors.ROSE) return "deeppink";
    else if (rawColor === RomCal.LiturgicalColors.PURPLE) return "purple";
    else if (rawColor === RomCal.LiturgicalColors.GREEN) return "green";
    else if (rawColor === RomCal.LiturgicalColors.WHITE) return "gold";
    else if (rawColor === RomCal.LiturgicalColors.GOLD) return "gold";

    throw new Error("Unrecognised liturgical color: "+rawColor.toString());
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
        let moment, result;

        for (let i = 0; i < calendar.length; i++) {
            if (calendar[i].moment) {
                moment = new Date(calendar[i].moment);

console.log(calendar[i]);

                if (
                    (moment.getFullYear() === today.getFullYear()) &&
                    (moment.getMonth() === today.getMonth()) &&
                    (moment.getDate() === today.getDate())
                ) {
                    result = 
                        convertRawColor(calendar[i].data.meta.liturgicalColor);
                    return result;
                }
            }
        }

        throw new Error("No matching color found.");
    }

    recolorElements(className, field) {
        const elements = document.querySelectorAll("."+className);

        elements.forEach(element => {
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
