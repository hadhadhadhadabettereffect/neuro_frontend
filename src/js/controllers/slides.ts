import { SiteArea, ContentChange } from "../constants/masks";
import { TransitionMS } from "../constants/options";


var changes = 0,
    activeSection = 0,
    nextSlide = 0,
    markedSlide = 0,
    scrollY = 0,
    prevScrollY = 0,
    targetScrollY = 0,
    scrollDist = 0,
    height = window.innerHeight;
var startTime, delta = 0;
var scrollUp = true;
var contentEl = document.getElementById("content"),
    agencySubNav = document.getElementById("subnav--agency").querySelectorAll(".subnav__link"),
    collectionSubNav = document.getElementById("subnav--collection").querySelectorAll(".subnav__link");

export function updateHeight() {
    height = window.innerHeight;
}

export function setActiveSection(section: number) {
    if (section === SiteArea.agency || section === SiteArea.collection) {
        activeSection = section;
        nextSlide = 0;
        scrollY = 0;
        prevScrollY = 0;
        changes |= ContentChange.subnav;
    }
}

export function scrollToSlide(slide: number) {
    nextSlide = slide;
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
    } else if (nextSlide < 3) {
        dist = ((nextSlide + 1) * height) - scrollY;
        if (dist / height < 0.5) scrollToSlide(nextSlide + 1);
    }
}

function updateSubnav() {
    if (markedSlide !== nextSlide) {
        if (activeSection === SiteArea.agency) {
            agencySubNav[markedSlide].className = "subnav__link";
            agencySubNav[nextSlide].className = "subnav__link subnav__link--active";
        } else if (activeSection === SiteArea.collection) {
            collectionSubNav[markedSlide].className = "subnav__link";
            collectionSubNav[nextSlide].className = "subnav__link subnav__link--active";
        }
        markedSlide = nextSlide;
    }
}
