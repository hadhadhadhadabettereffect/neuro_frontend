import { NavMeasure,
        TransitionMS } from "./constants/options";


const enum TimeUnits {
    hoursPerDay = 24,
    minsPerHour = 60,
    secsPerMin = 60,

    msPerSec = 1000,
    msPerMin = msPerSec * secsPerMin,
    msPerHour = msPerMin * minsPerHour,
}

const contactEl = document.createElement("div");
var clockEl = null;

var visible = false;
var transition = false;
var appendEl = false;
var awaitingHTML = true;

var timeoffset = -4 * TimeUnits.msPerHour; // UTC -4:00
var t = 0; // current time in ms
var delta = 0; // transition time
var startTime = 0;
var windowHeight = 0;
var yOffset = 0;
var elTop = 0;

var fetchContact = new XMLHttpRequest();
fetchContact.onreadystatechange = function () {
    if (fetchContact.readyState === XMLHttpRequest.DONE) {
        contactEl.id = "contact";
        contactEl.innerHTML = fetchContact.responseText;
        clockEl = contactEl.querySelector("#clock");
        awaitingHTML = false;
    }
};
fetchContact.open("GET", "/contact.html", true);
fetchContact.send();

export function toggleContact() {
    if (!transition) {
        transition = true;
        delta = 0;
        visible = !visible;
        windowHeight = window.innerHeight;
        if (visible) {
            elTop = windowHeight;
            yOffset = NavMeasure.nav_height - windowHeight;
            appendEl = true;
        } else {
            elTop = NavMeasure.nav_height;
            yOffset = windowHeight - NavMeasure.nav_height;
        }
        startTime = performance.now();
    }
}

export function updateContact(): boolean {
    if (awaitingHTML) return false;

    if (transition) showHide();
    // if contact form is active, animate clock
    if (visible && clockEl !== null) {
        // if at least 1 second has passed
        if ((Date.now() + timeoffset) - t > 999) {
            t = Date.now() + timeoffset;
            clockEl.innerText = getHours(t) + ':' +
                getMins(t) + ':' +
                getSecs(t);
        }
    }
    return !transition && !visible; // keep animating time if visible
}

function finalizeTransition () {
    transition = false;
    if (visible)
        contactEl.style.top = NavMeasure.nav_height + "px";
    else document.body.removeChild(contactEl);
}

function showHide () {
    delta = (performance.now() - startTime) / TransitionMS.popunder;
    contactEl.style.top = (elTop + (yOffset * delta) >>> 0) + "px";
    if (appendEl) {
        appendEl = false;
        document.body.appendChild(contactEl);
    } else if (delta > 1) finalizeTransition();
}


/**
 * Time helpers
 * returns 2-digit number as string
 */

function getHours(ms: number): string {
    let h = ((ms / TimeUnits.msPerHour) >>> 0) % TimeUnits.hoursPerDay;
    return h < 10 ? '0' + h : '' + h;
}
function getMins(ms: number): string {
    let m = ((ms / TimeUnits.msPerMin) >>> 0) % TimeUnits.minsPerHour;
    return m < 10 ? '0' + m : '' + m;
}
function getSecs(ms: number): string {
    let s = ((ms / TimeUnits.msPerSec) >>> 0) % TimeUnits.secsPerMin;
    return s < 10 ? '0' + s : '' + s;
}