import {
    ClickAction,
    ChangeHandler,
    ListenerEvent
} from "./enums";
import { clickNavLink } from "./nav";
import { toggleContact } from "./contact";
import { markChange } from "./changeloop";
import { markListenerEvent } from "./sections";

document.body.addEventListener("click", handleClick, false);
window.addEventListener("resize", handleResize, false);
document.getElementById("content").addEventListener("scroll", handleScroll, false);


function handleResize() {
    markListenerEvent(ListenerEvent.resize_mask);
    markChange(ChangeHandler.section_mask);
}

function handleScroll() {
    markListenerEvent(ListenerEvent.scroll_mask);
    markChange(ChangeHandler.section_mask);
}

function handleClick(event) {
    let action, flag = event.target.getAttribute("data-action");
    if (flag !== null) {
        action = flag | 0;
        switch (action) {
            case ClickAction.home:
            case ClickAction.agency:
            case ClickAction.collection:
                if (clickNavLink(action))
                    markChange(ChangeHandler.nav_mask);
                break;

            case ClickAction.contact:
                toggleContact();
                markChange(ChangeHandler.contact_mask);
        }
    }
}