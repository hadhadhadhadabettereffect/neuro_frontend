import { ClickAction } from "./constants/actions";
import { ChangeHandler,
        ContentChange } from "./constants/masks";
import { toggleContact } from "./controllers/contact";
import { showDetails,
        clickDetailThumb,
        toggleProductInfo } from "./controllers/products";
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
    let clickId, flag = event.target.getAttribute("data-action");
    if (flag !== null) {
        switch (flag | 0) {
            case ClickAction.nav:
                clickId = event.target.getAttribute("data-id") | 0;
                if (navToSection(clickId)) {
                    setActiveSection(clickId);
                    markChange(ChangeHandler.navigate);
                }
                break;

            case ClickAction.subnav:
                scrollToSlide(event.target.getAttribute("data-id") | 0);
                markChange(ChangeHandler.slides);
                break;

            case ClickAction.contact:
                toggleContact();
                markChange(ChangeHandler.contact);
                break;

            case ClickAction.product:
                showDetails(event.target.getAttribute("data-id") | 0);
                markChange(ChangeHandler.product);
                break;

            case ClickAction.gallery:
                if(clickDetailThumb(event.target.getAttribute("data-id") | 0))
                    markChange(ChangeHandler.product);
                break;

            case ClickAction.info:
                if (toggleProductInfo(event.target.getAttribute("data-id") | 0))
                    markChange(ChangeHandler.product);
                break;

            case ClickAction.share:
                console.log("share product");
                break;

            case ClickAction.order:
                console.log("order product");
                break;
        }
    }
}
