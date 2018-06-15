import { ContentChange } from "../constants/masks";
import { LandingPage } from "../constants/groups";
import { TransitionMS } from "../constants/options";


const transformVis = "rotate(-90deg) translateY(-300px) scaleX(1)";
const transformHidden = "rotate(-90deg) translateY(-300px) scaleX(0)";
const contentEl = document.getElementById("content");
const navLinks = [
    document.querySelector("#nav--left > .nav__link--side"),
    document.querySelector("#nav--right > .nav__link--side")
];
const subnavs = [
    // LandingPage.agency
    document.getElementById("subnav--agency"),
    // LandingPage.collection
    document.getElementById("subnav--collection")
];
const subnavLinks = [
    document.getElementById("subnav--agency").querySelectorAll(".subnav__link"),
    document.getElementById("subnav--collection").querySelectorAll(".subnav__link")
];
let changes = 0,
    activeSection = LandingPage.home,
    activeSubnav = LandingPage.home,
    nextSlide = 0,
    markedSlide = 0,
    scrollY = 0,
    prevScrollY = 0,
    targetScrollY = 0,
    scrollDist = 0,
    height = window.innerHeight;
let startTime, delta = 0;
let scrollUp = false;

export function updateHeight() {
    height = window.innerHeight;
}

export function setActiveSection(section: number) {
    activeSection = section;
    nextSlide = 0;
    scrollY = 0;
    prevScrollY = 0;
    changes |= ContentChange.subnav;
}

export function scrollToSlide(slide: number) {
    onEnterSlide(slide);
    if (nextSlide !== slide) {
        onLeaveSlide(nextSlide);
        nextSlide = slide;

    }
    targetScrollY = nextSlide * height;
    changes |= ContentChange.jump_and_subnav;
    scrollY = contentEl.scrollTop;
    prevScrollY = scrollY;
    scrollDist = targetScrollY - scrollY;
    startTime = performance.now();
}

export function markSlidesChange(changeMask) {
    changes |= changeMask;
}

export function updateSlides(): boolean {
    // go to a particular slide
    if (changes & ContentChange.jump) {
        moveToNextSlide();
    }
    // ignore scroll listener if actively transitioning to another slide
    else if (changes & ContentChange.scroll) {
        changes ^= ContentChange.scroll;
        changes |= ContentChange.postscroll;
        handleScroll();
    }
    // if finished scrolling
    else if (changes & ContentChange.postscroll) {
        changes ^= ContentChange.postscroll;
        onAfterScroll();
    }
    // update highlighted subnav item
    if (changes & ContentChange.subnav) {
        changes ^= ContentChange.subnav;
        updateSubnav();
    }
    return changes === 0;
}

function moveToNextSlide() {
    delta = (performance.now() - startTime) / TransitionMS.slide;
    if (delta > 1) {
        scrollY = targetScrollY;
        changes &= ContentChange.not_jump_subnav;
    } else {
        scrollY = (prevScrollY + (scrollDist * delta)) >>> 0;
    }
    contentEl.scrollTop = scrollY;
    return false;
}

function handleScroll() {
    prevScrollY = scrollY;
    scrollY = contentEl.scrollTop;
    scrollUp = scrollY < prevScrollY;
    nextSlide = (scrollY / height) >>> 0;
    if (nextSlide !== markedSlide) updateSubnav();
}

// gravitate toward nearest slide after scroll
function onAfterScroll() {
    var dist;
    if (scrollUp) {
        dist = scrollY - (nextSlide * height);
        if (dist / height < 0.5) scrollToSlide(nextSlide);
        else if (nextSlide < 3) scrollToSlide(nextSlide + 1);
    } else if (nextSlide < 3) {
        dist = ((nextSlide + 1) * height) - scrollY;
        if (dist / height < 0.5) scrollToSlide(nextSlide + 1);
        else scrollToSlide(nextSlide);
    }
}

function updateSubnav() {
    // show/hide subnavs on nav
    if (activeSection !== activeSubnav) {
        if (activeSubnav !== LandingPage.home) {
            navLinks[activeSubnav].className = "nav__link--side";
            subnavs[activeSubnav].style.transform = transformHidden;
            // clear marked subnav item
            subnavLinks[activeSubnav][markedSlide].className = "subnav__link";
        }
        if (activeSection !== LandingPage.home) {
            navLinks[activeSection].className = "nav__link--side nav__link--active";
            subnavs[activeSection].style.transform = transformVis;
            // set first subnav item as active
            subnavLinks[activeSection][0].className = "subnav__link subnav__link--active";
        }
        activeSubnav = activeSection;
    }

    // set active subnav item after scroll or link click
    else if (markedSlide !== nextSlide && activeSubnav !== LandingPage.home) {
        subnavLinks[activeSubnav][markedSlide].className = "subnav__link";
        subnavLinks[activeSubnav][nextSlide].className = "subnav__link subnav__link--active";
        markedSlide = nextSlide;
    }
}


function onLeaveSlide(slide: number) {
    console.log(`left slide ${slide}`);
    switch (slide) {
        case 0:
            // pauseVideo
            (document.querySelector("#content video") as HTMLVideoElement).pause();
            break;
        case 2:
            // scroll x to 0
            break;
    }
}


function onEnterSlide(slide: number) {
    console.log(`entered slide ${slide}`);
    switch (slide) {
        case 0:
            // play vid;
            (document.querySelector("#content video") as HTMLVideoElement).play();
            break;

    }
}


