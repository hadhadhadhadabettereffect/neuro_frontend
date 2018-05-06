const enum TimeUnits {
    hoursPerDay = 24,
    minsPerHour = 60,
    secsPerMin = 60,

    msPerSec = 1000,
    msPerMin = msPerSec * secsPerMin,
    msPerHour = msPerMin * minsPerHour,
}

const enum ContactForm {
    transitionMs = 280,
    elTop = 75,
}

const contactEl = document.createElement("div");
var clockEl = null;

var visible = false;
var transition = false;

var timeoffset = -4 * TimeUnits.msPerHour; // UTC -4:00
var t = 0; // current time in ms
var delta = 0; // transition time
var startTime = 0;
var windowHeight = 0;

// fetch contact form html
var httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function(){
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        contactEl.id = "contact";
        contactEl.innerHTML = httpRequest.responseText;
        clockEl = contactEl.querySelector("#clock");
    }
};
httpRequest.open("GET", '/contact.html', true);
httpRequest.send();

export function toggleContact() {
    if (!transition) {
        transition = true;
        delta = 0;
        visible = !visible;
    }
}

function show() {
    if (delta === 0) {
        windowHeight = window.innerHeight + ContactForm.elTop;
        contactEl.style.top = windowHeight + "px";
        document.body.appendChild(contactEl);
        startTime = performance.now();
    } else {
        if (delta > 1) {
            contactEl.style.top = ContactForm.elTop + "px";
            transition = false;
        } else {
            contactEl.style.top = windowHeight - (windowHeight * delta) + "px";
        }
    }
    delta = (performance.now() - startTime) / ContactForm.transitionMs;
}

function hide() {
    if (delta === 0) {
        windowHeight = window.innerHeight;
        startTime = performance.now();
    }
    delta = (performance.now() - startTime) / ContactForm.transitionMs;
    if (delta > 1) {
        document.body.removeChild(contactEl);
        transition = false;
    } else {
        contactEl.style.top = ContactForm.elTop + (windowHeight * delta) + "px"
    }
}

export function updateContact(): boolean {
    if (transition) {
        if (visible) show();
        else hide();
    }
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