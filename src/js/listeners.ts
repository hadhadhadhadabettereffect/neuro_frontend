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
        nextProduct } from "./controllers/products";
import { navToSection } from "./controllers/page";
import { markSlidesChange,
        clickSubnav,
        setActiveSection } from "./controllers/slides";
import { activateLift } from "./controllers/lift";
import { clickFilter } from "./controllers/filters";
import { markChange } from "./loop";


document.body.addEventListener("mousedown", handleClick, false);
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
                    markChange(ChangeHandler.filters);
                break;
        }
    }
}
