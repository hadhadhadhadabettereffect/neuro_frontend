import { StoryUpdate } from "../constants/masks";

declare var NEURO;

declare const enum PageType {
    text,
    slider,
}


var currentPage = 0;
var nextPage = 0;
var updates = 0;
var x0 = 0, x1 = 0;

var baseWidth = 400;
var maxWidth = 800;
var width = 400;

const contentWrap = document.getElementById("story__content");
const pageNumbers = Array.prototype.slice.call(document.getElementsByClassName("story__link"));
var sliderImg;

var pageData;

const reqData = new XMLHttpRequest();
reqData.onreadystatechange = function () {
    if (reqData.readyState === XMLHttpRequest.DONE) {
        pageData = JSON.parse(reqData.responseText);
        requestAnimationFrame(setPageContent);
    }
};
reqData.open("GET", "/story/content.json", true);
reqData.send();



export function setStoryPage(page: number) {
    currentPage = page;
    updates |= StoryUpdate.page;
}

export function startSlider(event) {
    x0 = event.clientX;
    updates |= StoryUpdate.slider;
    window.addEventListener("mousemove", handleMouseMove, false);
    window.addEventListener("mouseup", handleMouseUp, false);
}

export function updateStory(): boolean {
    if (updates & StoryUpdate.slider) {
        updateSlider();
    }
    if (updates & StoryUpdate.page) {
        setPageContent();
        updates ^= StoryUpdate.page;
    }
    return updates === 0;
}

function updateSlider() {
    let diff = x1 - x0;
    width = baseWidth + diff;
    if (width < 0) width = 0;
    else if (width > maxWidth) width = maxWidth;
    sliderImg.style.width = width + "px";
}

function handleMouseMove(event: MouseEvent) {
    x1 = event.clientX;
}

function handleMouseUp() {
    window.removeEventListener("mousemove", handleMouseMove, false);
    window.removeEventListener("mouseup", handleMouseUp, false);
    if (updates & StoryUpdate.slider)
        updates ^= StoryUpdate.slider;
}

function setPageContent() {
    pageNumbers[currentPage].className = "story__link";
    pageNumbers[nextPage].className = "story__link--active";
    if (NEURO.story_page_types[currentPage] === PageType.slider) {
        sliderImg = null;
    }
    currentPage = nextPage;
    contentWrap.innerHTML = pageData[currentPage];

    if (NEURO.story_page_types[currentPage] === PageType.slider) {
        sliderImg = contentWrap.querySelector(".slider__top");
    }
}
