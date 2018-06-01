import { ChangeHandler } from "./constants/masks";
import { updateContact } from "./controllers/contact";
import { updateContent,
        updateWidth } from "./controllers/page";
import { updateSlides,
        updateHeight } from "./controllers/slides";
import { updateProductDetails } from "./controllers/products";


var changes = 0;

export function markChange(changeMask: number) {
    changes |= changeMask;
}

function animate() {
    requestAnimationFrame(animate);
    applyUpdates();
}

function applyUpdates() {
    if (changes) {
        // only applying changes to one handler at a time
        // so if contact is active, nav and sections wont change
        if (changes & ChangeHandler.contact) {
            if (updateContact())
                changes ^= ChangeHandler.contact;
        }
        else if (changes & ChangeHandler.page) {
            if (updateContent())
                changes ^= ChangeHandler.page;
        }
        else if (changes & ChangeHandler.product) {
            if (updateProductDetails())
                changes ^= ChangeHandler.product;
        }
        else if (changes & ChangeHandler.slides) {
            if (updateSlides())
                changes ^= ChangeHandler.slides;
        }
        else if (changes & ChangeHandler.resize) {
            changes ^= ChangeHandler.resize;
            updateWidth();
            updateHeight();
        }
    }
}

requestAnimationFrame(animate);
