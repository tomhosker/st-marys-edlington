/*
This is a front end script which changes the colours of elements according to
the current liturgical colour.
*/

// A helper function.
function recolorElements(oldClassName, newClassName) {
    let elementList = document.getElementsByClassName(oldClassName);

    for (let i = 0; i < elementList.length; i++) {
        elementList[i].classList.replace(oldClassName, newClassName);
    }
}

// The class in question.
class ColorChanger {
    constructor() {
        this.litColor = "green";
    }

    // Change the colour of each element.
    changeColors() {
        recolorElements("liturgical-background", this.litColor+"-background");
        recolorElements("liturgical-border", this.litColor+"-border");
    }
}

// Let's get cracking...
const colorChanger = new ColorChanger();
colorChanger.changeColors();
