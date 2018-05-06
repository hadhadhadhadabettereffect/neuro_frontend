const enum TimeUnits {
    hoursPerDay = 24,
    minsPerHour = 60,
    secsPerMin = 60,

    msPerSec = 1000,
    msPerMin = msPerSec * secsPerMin,
    msPerHour = msPerMin * minsPerHour,

    mod4 = 0x3,
}

const contactEl = document.getElementById("contact");
const clockEl = document.getElementById("clock");

var visible = false;
var transition = false;

var timezone = "EDT";
var timeoffset = -4 * TimeUnits.msPerHour; // UTC -4:00
var t = 0; // current time in ms

document.getElementById("timezone").innerText = timezone;

export function toggleContact() {
    transition = true;
    visible = !visible;
}

export function updateContact(): boolean {
    if (transition) {
        contactEl.style.bottom = visible ? "0" : "-100%";
        transition = false;
    }
    // if contact form is active, animate clock
    if (visible) {
        // if at least 1 second has passed
        if ((Date.now() + timeoffset) - t > 999) {
            t = Date.now() + timeoffset;
            clockEl.innerText = getHours(t) + ':' +
                getMins(t) + ':' +
                getSecs(t);
        }
    }
    return !visible; // keep animating time if visible
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