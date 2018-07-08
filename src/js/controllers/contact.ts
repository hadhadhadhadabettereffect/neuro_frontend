import { NavMeasure,
        TransitionMS } from "../constants/options";

const enum TimeUnits {
    hoursPerDay = 24,
    minsPerHour = 60,
    secsPerMin = 60,

    msPerSec = 1000,
    msPerMin = msPerSec * secsPerMin,
    msPerHour = msPerMin * minsPerHour,
}


const contactEl = document.createElement("div");
const liftEl = document.getElementById("lift__content");
var clockEl = document.createElement("div");

var active = false;
var attached = false;
var remount = false;

var timeoffset = -4 * TimeUnits.msPerHour; // UTC -4:00
var t = 0; // current time in ms

var fetchContact = new XMLHttpRequest();
fetchContact.onreadystatechange = function () {
    if (fetchContact.readyState === XMLHttpRequest.DONE) {
        contactEl.id = "contact";
        contactEl.innerHTML = fetchContact.responseText;
        clockEl = contactEl.querySelector("#clock");
    }
};
fetchContact.open("GET", "/contact.html", true);
fetchContact.send();


export function attachContact(show: boolean) {
    if (attached !== show) {
        attached = show
        remount = true;
    }
}

export function showContact(show: boolean) {
    active = show;
    if (active && !attached) {
        attached = true;
        remount = true;
    }
}

export function updateContact(): boolean {
    if (remount) {
        remount = false;
        if (attached) {
            if (contactEl.parentElement !== liftEl) {
                contactEl.remove();
                liftEl.appendChild(contactEl);
            }
        } else contactEl.remove();
    }

    // if contact form is active, animate clock
    else if (active) {
        // if at least 1 second has passed
        if ((Date.now() + timeoffset) - t > 999) {
            t = Date.now() + timeoffset;
            clockEl.innerText = getHours(t) + ':' +
                getMins(t) + ':' +
                getSecs(t);
        }
    }
    return active; // keep animating time if visible
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