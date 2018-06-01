import { ClickAction } from "./constants/actions";
import { ChangeHandler,
        ContentChange } from "./constants/masks";
import { toggleContact } from "./controllers/contact";
import { showDetails } from "./controllers/products";
import { navToSection } from "./controllers/page";
import { markSlidesChange,
        scrollToSlide,
        setActiveSection } from "./controllers/slides";
import { markChange } from "./loop";


document.body.addEventListener("click", handleClick, false);
window.addEventListener("resize", handleResize, false);
document.getElementById("content").addEventListener("scroll", handleScroll, false);

window.onpopstate = function(event) {
    if (event.state.hasOwnProperty("page")) {
        let p = event.state.page;
        if (navToSection(p)) {
            setActiveSection(p);
            markChange(ChangeHandler.navigate);
        }
    }
};

function handleResize() {
    markChange(ChangeHandler.resize);
}

function handleScroll() {
    markSlidesChange(ContentChange.scroll);
    markChange(ChangeHandler.slides);
}

function handleClick(event) {
    let action, flag = event.target.getAttribute("data-action");
    if (flag !== null) {
        action = flag | 0;
        switch (action) {
            case ClickAction.home:
            case ClickAction.agency:
            case ClickAction.collection:
                if (navToSection(action)) {
                    setActiveSection(action);
                    markChange(ChangeHandler.navigate);
                }
                break;

            case ClickAction.contact:
                toggleContact();
                markChange(ChangeHandler.contact);
                break;

            case ClickAction.product:
                showDetails(event.target.getAttribute("data-product") | 0);
                break;

            case ClickAction.subnav_0:
            case ClickAction.subnav_1:
            case ClickAction.subnav_2:
            case ClickAction.subnav_3:
                scrollToSlide(action - ClickAction.subnav_offset);
                markChange(ChangeHandler.slides);
                break;
        }
    }
}
