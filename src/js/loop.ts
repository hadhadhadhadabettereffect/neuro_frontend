import { ChangeHandler } from "./constants/masks";
import { updateContact } from "./controllers/contact";
import { updateContent,
        updateWidth } from "./controllers/page";
import { updateSlides,
        updateHeight } from "./controllers/slides";
import { updateProductDetails } from "./controllers/products";
import { updateFilters } from "./controllers/filters";
import { updateLift } from "./controllers/lift";

var changes = 0;
var start;

export function markChange(changeMask: number) {
    changes |= changeMask;
}

function animate() {
    requestAnimationFrame(animate);
    applyUpdates();
}

function applyUpdates() {
    if (changes) {
        start = performance.now();

        // update width height first since it could affect other items
        if (changes & ChangeHandler.resize) {
            changes ^= ChangeHandler.resize;
            updateWidth();
            updateHeight();
            if (performance.now() - start > 3) return;
        }

        if (changes & ChangeHandler.slides) {
            if (updateSlides())
                changes ^= ChangeHandler.slides;
            if (performance.now() - start > 3) return;
        }

        // wait for product info to load before showing details
        if (changes & ChangeHandler.product) {
            if (updateProductDetails())
                changes ^= ChangeHandler.product;
            if (performance.now() - start > 3) return;
        } else if (changes & ChangeHandler.lift) {
            if (updateLift())
                changes ^= ChangeHandler.lift;
            if (performance.now() - start > 3) return;
        }

        // these shouldn't need updates at the same time
        if (changes & ChangeHandler.page) {
            if (updateContent())
                changes ^= ChangeHandler.page;
            if (performance.now() - start > 3) return;
        } else if (changes & ChangeHandler.contact) {
            if (updateContact())
                changes ^= ChangeHandler.contact;
            if (performance.now() - start > 3) return;
        } else if (changes & ChangeHandler.filters) {
            if (updateFilters())
                changes ^= ChangeHandler.filters;
            if (performance.now() - start > 3) return;
        }
    }
}

requestAnimationFrame(animate);
