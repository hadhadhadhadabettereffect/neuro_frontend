import { ClickAction } from "./enums";
import { clickNavLink } from "./nav";
import { toggleContact } from "./contact";

document.body.addEventListener("click", handleClick, false);

function handleClick (event) {
    let action, flag = event.target.getAttribute("data-action");
    if (flag !== null) {
        action = flag|0;
        switch (action) {
            case ClickAction.home:
            case ClickAction.agency:
            case ClickAction.collection:
                clickNavLink(action);
                break;

            case ClickAction.contact:
                toggleContact();
        }
    }
}