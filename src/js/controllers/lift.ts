import { TransitionMS } from "../constants/options";


const liftWrap = document.getElementById("lift");
var visible = false;
var transition = false;
var init = false;
var delta = 0; // transition time
var startTime = 0;


export function activateLift(vis: boolean) {
    visible = vis;
    transition = true;
    delta = 0;
    init = true;
}

export function updateLift(): boolean {
    if (transition) showHide();
     return !transition;
}

function initTransition() {
    init = false;
    startTime = startTime = performance.now();
    if (visible) liftWrap.style.display = "block";
}

function finalizeTransition() {
    transition = false;
    if (visible) liftWrap.style.transform = "";
    else liftWrap.style.display = "none";
}

function showHide() {
    if (init) initTransition();
    delta = (performance.now() - startTime) / TransitionMS.lift_divide;
    if (delta >= 100.0)
        finalizeTransition();
    else if (visible)
        liftWrap.style.transform = "translateY(" + (100-delta).toFixed(1) + "%)";
    else
        liftWrap.style.transform = "translateY(" + delta.toFixed(1) + "%)";
}
