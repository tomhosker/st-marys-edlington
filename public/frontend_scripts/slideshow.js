/*
This is a front end script which defines a class modelling a slideshow.
*/

// Constants.
const DEFAULT_TIMEOUT = 5000;

// The class in question.
class Slideshow {
    constructor() {
        this.slides = document.getElementsByClassName("mySlides");
        this.slideIndex = 0;
    }

    // Go to the next slide.
    nextSlide() {
        for (let i = 0; i < this.slides.length; i++) {
            this.slides[i].style.display = "none";
        }
        if (this.slideIndex >= this.slides.length) this.slideIndex = 0;
        this.slides[this.slideIndex].style.display = "block";  
        this.slideIndex++;
    }
}

// Helper function.
function runTheSlideshow(slideshow) {
    slideshow.nextSlide();
    setTimeout(runTheSlideshow, DEFAULT_TIMEOUT, slideshow);
}

// Let's get cracking...
const theSlideshow = new Slideshow();
runTheSlideshow(theSlideshow);
