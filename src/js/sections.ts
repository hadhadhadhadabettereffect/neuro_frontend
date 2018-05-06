import { ListenerEvent } from "./enums";

var changes = 0;
var width = 0, height = 0;

export function markListenerEvent(changeMask) {
    changes |= changeMask;
}

export function updateSections(): boolean {
    if (changes & ListenerEvent.resize_mask) {
        changes ^= ListenerEvent.resize_mask;
        handleResize();
    }
    if (changes & ListenerEvent.scroll_mask) {
        changes ^= ListenerEvent.scroll_mask;
        handleScroll();
    }
    return true;
}

function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;
}

function handleScroll() {

}


var agencySlides = [];
