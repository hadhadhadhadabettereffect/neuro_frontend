import { StoryUpdate } from "../constants/masks";

declare var NEURO;

declare const enum PageType {
    none,
    text,
    slider,
}


var currentPage = 0;
var nextPage = 0;
var updates = 0;
var pageType = PageType.none;
var x0 = 0, x1 = 0;

var baseWidth = 400;
var maxWidth = 800;
var width = 400;

const contentWrap = document.getElementById("story__content");
const pageNumbers = Array.prototype.slice.call(document.getElementsByClassName("story__link"));
const textContent = document.getElementById("story-page--text");
const textTitle = textContent.querySelector("h2");
const textText = textContent.querySelector("p");
const textImg = textContent.querySelector("img");
const sliderContent = document.getElementById("story-page--slider");
const sliderTop = sliderContent.querySelector(".slider__top") as HTMLElement;
const sliderImgA = sliderContent.querySelector(".slider__top") as HTMLImageElement;
const sliderImgB = sliderContent.querySelector(".slider__btm") as HTMLImageElement;

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

console.log()

export function setStoryPage(page: number) {
    nextPage = page;
    updates |= StoryUpdate.page;
}

export function startSlider(event) {
    x0 = event.clientX;
    updates |= StoryUpdate.slider;
    baseWidth = sliderImgA.getBoundingClientRect().width;
    maxWidth = sliderContent.getBoundingClientRect().width;
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
    sliderTop.style.width = (100* width/maxWidth).toFixed(2) + "%";
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
    const d = pageData[nextPage];
    console.log(d);
    pageNumbers[currentPage].className = "story__link";
    pageNumbers[nextPage].className = "story__link--active";

    if (pageType !== d.page_type) {
        pageType = d.page_type;
        if (pageType === PageType.text) {
            sliderContent.remove();
            contentWrap.appendChild(textContent);
        } else {
            textContent.remove();
            contentWrap.appendChild(sliderContent);
        }
    }
    currentPage = nextPage;
    if (pageType === PageType.text) {
        textTitle.innerText = d.title;
        textText.innerText = d.text;
        textImg.src = "/media/" + d.image_a;
    } else {
        x0 = x1 = 0;
        baseWidth = maxWidth >>> 1;
        sliderImgA.style.backgroundImage = "url(/media/" + d.image_a + ")";
        sliderImgB.src ="/media/" + d.image_b;
        updateSlider();
    }
}
