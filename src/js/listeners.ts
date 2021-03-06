import { ClickAction } from "./constants/actions";
import { ChangeHandler,
        ContentChange } from "./constants/masks";
import { attachContact,
        showContact } from "./controllers/contact";
import { showDetails,
        attachDetails,
        clickDetailThumb,
        clickOrderProduct,
        clickShare,
        startTurner,
        toggleProductInfo,
        clickFilter,
        nextProduct } from "./controllers/products";
import { navToSection } from "./controllers/page";
import { markSlidesChange,
        clickSubnav,
        setActiveSection } from "./controllers/slides";
import { activateLift } from "./controllers/lift";
import { setStoryPage,
        startSlider } from "./controllers/story";
import { markChange } from "./loop";

declare var NEURO;

document.body.addEventListener("mousedown", handleClick, false);
window.addEventListener("resize", handleResize, false);
document.getElementById("content").addEventListener("scroll", handleScroll, false);

window.onpopstate = function(event) {
    if (event.state.hasOwnProperty("page")) {
        navTo(event.state.page);
    } else {
        navTo(NEURO.active);
    }
};


function navTo(page: number) {
    if (navToSection(page)) {
        setActiveSection(page);
        markChange(ChangeHandler.navigate);
    }
}

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
                navTo(event.target.getAttribute("data-id") | 0);
                break;

            case ClickAction.subnav:
                clickSubnav(event.target.getAttribute("data-id") | 0);
                markChange(ChangeHandler.slides);
                break;

            case ClickAction.contact:
                attachDetails(false);
                showContact(true);
                activateLift(true);
                markChange(ChangeHandler.liftedContent);
                break;

            case ClickAction.product_show:
                showDetails(event.target.getAttribute("data-id") | 0);
                attachContact(false);
                activateLift(true);
                markChange(ChangeHandler.liftedContent);
                break;

            case ClickAction.product_turn:
                startTurner(event);
                markChange(ChangeHandler.product);
                break;

            case ClickAction.product_gallery:
                if(clickDetailThumb(event.target.getAttribute("data-id") | 0))
                    markChange(ChangeHandler.product);
                break;

            case ClickAction.product_next:
                nextProduct(event.target.getAttribute("data-id") | 0);
                markChange(ChangeHandler.product);
                break;

            case ClickAction.product_info:
                if (toggleProductInfo(event.target.getAttribute("data-id") | 0))
                    markChange(ChangeHandler.product);
                break;

            case ClickAction.product_share:
                if (clickShare(event.target.getAttribute("data-id") | 0)) {
                    markChange(ChangeHandler.product);
                }
                break;

            case ClickAction.product_order:
                if (clickOrderProduct()) markChange(ChangeHandler.product);
                break;

            case ClickAction.lower_lift:
                activateLift(false);
                showContact(false);
                markChange(ChangeHandler.lift);
                break;

            case ClickAction.filter:
                if (clickFilter(event.target.getAttribute("data-id") | 0))
                    markChange(ChangeHandler.product);
                break;

            case ClickAction.story_nav:
                console.log(event.target);
                setStoryPage(event.target.getAttribute("data-id") | 0);
                markChange(ChangeHandler.story);
                break;

            case ClickAction.slider:
                startSlider(event);
                markChange(ChangeHandler.story);
                break;
        }
    }
}
