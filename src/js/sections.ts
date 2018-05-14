import {
    SectionChange,
    SiteArea,
    NavMeasure
} from "./enums";

var changes = 0;
var width = window.innerWidth,
    height = window.innerHeight,
    startX = 0,
    moveX = 0;
var scrollY = 0,
    prevScrollY = 0,
    targetScrollY = 0,
    scrollDist = 0,
    scrollDown = true;

var slideHeight = (width < NavMeasure.min_width) ?
        height - NavMeasure.nav_height : height - NavMeasure.top_btm_space;
var activeSection = SiteArea.home,
    prevSection = SiteArea.home,
    activeContent = SiteArea.home,
    nextSlide = 0,
    markedSlide = 0;
var startTime, delta = 0;
var initMove = true;
var wrapEl = document.getElementById("wrap"),
    contentEl = document.getElementById("content"),
    agencyEl = document.createElement("div"),
    collectionEl = document.createElement("div"),
    agencySubNav = document.getElementById("subnav--agency").querySelectorAll(".subnav__item");

// fetch agency and collection html
var httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.responseURL == "http://localhost:8000/agency.html") {
            agencyEl.className = "content__inner";
            agencyEl.innerHTML = httpRequest.responseText;
            httpRequest.open("GET", "/collection.html", true);
            httpRequest.send();
        } else {
            collectionEl.className = "content__inner";
            collectionEl.innerHTML = httpRequest.responseText;
            httpRequest = null;
        }
    }
};
httpRequest.open("GET", "/agency.html", true);
httpRequest.send();

export function navToSection(section: number) {
    prevSection = activeSection;
    activeSection = section;
    nextSlide = 0;
    scrollY = 0;
    prevScrollY = 0;
    changes |= SectionChange.nav_and_subnav;
    initMove = true;
}

export function scrollToSlide(slide: number) {
    nextSlide = slide;
    targetScrollY = nextSlide * slideHeight;
    changes |= SectionChange.slide_and_subnav;
    scrollY = contentEl.scrollTop;
    prevScrollY = scrollY;
    scrollDist = targetScrollY - scrollY;
    startTime = performance.now();
}

export function markSectionEvent(changeMask) {
    changes |= changeMask;
}

export function updateSections(): boolean {
    // go to a particular slide
    if (changes & SectionChange.slide_mask) {
        moveToNextSlide();
    }
    // ignore scroll listener if actively transitioning to another slide
    else if (changes & SectionChange.scroll_mask) {
        changes ^= SectionChange.scroll_mask;
        handleScroll();
    }
    // update measurements on window resize
    if (changes & SectionChange.resize_mask) {
        changes ^= SectionChange.resize_mask;
        handleResize();
    }
    // mpve btw agency, home, collection areas
    if (changes & SectionChange.navigate_mask) {
        handleTransition();
    }
    // update highlighted subnav item
    if (changes & SectionChange.subnav_mask) {
        changes ^= SectionChange.subnav_mask;
        updateSubnav();
    }
    return changes === 0;
}

function moveToNextSlide () {
    delta = (performance.now() - startTime) / SectionChange.transition_ms;
    if (delta > 1) {
        scrollY = targetScrollY;
        changes &= SectionChange.not_scroll_slide;
    } else {
        scrollY = (prevScrollY + (scrollDist * delta)) >>> 0;
    }
    contentEl.scrollTop = scrollY;
    return false;
}

function initTransition() {
    initMove = false;
    // hide scroll bars when moving
    contentEl.style.overflowY = "hidden";

    // if coming from either size, first move off to side
    if (prevSection === SiteArea.agency) {
        startX = 0;
        moveX = -width;
    } else if (prevSection === SiteArea.collection) {
        startX = 0;
        moveX = width;
    } else {
        wrapEl.style.display = "block";
        // if coming from home, move from off screen to 0
        if (activeSection === SiteArea.agency) {
            startX = -width;
            moveX = width;
        } else {
            startX = width;
            moveX = -width;
        }
        // switch content if needed
        if (activeSection !== activeContent) {
            if (contentEl.firstChild)
                contentEl.removeChild(contentEl.firstChild);
            contentEl.appendChild(activeSection === SiteArea.agency ?
                agencyEl : collectionEl);
            activeContent = activeSection;
        }
    }
    startTime = performance.now();
}

function handleTransition() {
    if (initMove) initTransition();
    delta = (performance.now() - startTime) / SectionChange.transition_ms;
    if (delta > 1) {
        // done if moving to home
        if (activeSection === SiteArea.home) {
            changes ^= SectionChange.navigate_mask;
            wrapEl.style.display = "none";
        }
        // done if coming from home
        else if (prevSection === SiteArea.home) {
            changes ^= SectionChange.navigate_mask;
            contentEl.style.overflowY = "auto";
            wrapEl.style.left = "0";
            prevSection = activeSection;
        }
        // if coming from one side and moving to the other
        // start moving towards other side after moving from prevSide
        else {
            prevSection = SiteArea.home;
            initMove = true;
        }
    } else {
        wrapEl.style.left = (startX + (moveX * delta)) + "px";
    }
}

function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;
}

// highlight subnav link for active slide
function handleScroll() {
    prevScrollY = scrollY;
    scrollY = contentEl.scrollTop;
    nextSlide = (scrollY / slideHeight) >>> 0;
    if (nextSlide !== markedSlide) updateSubnav();
}

function updateSubnav() {
    if (markedSlide !== nextSlide) {
        if (prevSection === SiteArea.agency) {
            agencySubNav[markedSlide].className = "subnav__item";
            agencySubNav[nextSlide].className = "subnav__item subnav__item--active";
        } else if (prevSection === SiteArea.collection) {
            // same with collection subnav
        }
        markedSlide = nextSlide;
    }
}