/*
This is a front end script which changes the colours of elements according to
the current liturgical colour.
*/

// A helper function.
function recolorElements(className, field, color) {
    const elements = document.querySelectorAll("."+className);

    elements.forEach(element => { element.style[field] = color; });
}

// The class in question.
class ColorChanger {
    constructor() {
        this.litColor = "green";
    }

    recolorElements(className, field) {
        const elements = document.querySelectorAll("."+className);

        elements.forEach(element => { element.style[field] = this.litColor; });
    }

    recolor() {
        this.recolorElements("liturgical-background", "background-color");
        this.recolorElements("liturgical-border", "border-color");
    }
}

// Let's get cracking...
const colorChanger = new ColorChanger();
colorChanger.recolor();
