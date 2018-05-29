import {
    ClickAction,
    ChangeHandler,
    SectionChange
} from "./enums";
import { clickNavLink } from "./nav";
import { toggleContact } from "./contact";
import { markChange } from "./changeloop";
import {
    markSectionEvent,
    navToSection,
    scrollToSlide
} from "./sections";
import { showDetails } from "./details";


document.body.addEventListener("click", handleClick, false);
window.addEventListener("resize", handleResize, false);
document.getElementById("content").addEventListener("scroll", handleScroll, false);

window.onpopstate = function(event) {
    if (event.state.hasOwnProperty("page")) {
        let p = event.state.page;
        if (clickNavLink(p)) {
            navToSection(p);
            markChange(ChangeHandler.nav_section_mask);
        }
    }
};

function handleResize() {
    markSectionEvent(SectionChange.resize_mask);
    markChange(ChangeHandler.section_mask);
}

function handleScroll() {
    markSectionEvent(SectionChange.scroll_mask);
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
                if (clickNavLink(action)) {
                    navToSection(action);
                    markChange(ChangeHandler.nav_section_mask);
                }
                break;

            case ClickAction.contact:
                toggleContact();
                markChange(ChangeHandler.contact_mask);
                break;

            case ClickAction.product:
                showDetails(event.target.getAttribute("data-product") | 0);
                break;

            case ClickAction.agency_about:
            case ClickAction.agency_services:
            case ClickAction.agency_work:
            case ClickAction.agency_team:
                scrollToSlide(action - ClickAction.agency_nav_offset);
                markChange(ChangeHandler.section_mask);
                break;
        }
    }
}