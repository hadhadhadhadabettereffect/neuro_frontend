import { ChangeHandler } from "./constants/masks";
import { updateContact } from "./controllers/contact";
import { updateContent,
        updateWidth } from "./controllers/page";
import { updateSlides,
        updateHeight } from "./controllers/slides";
import { updateProductDetails } from "./controllers/products";
import { updateLift } from "./controllers/lift";
import { updateStory } from "./controllers/story";

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
            if (changes === 0 || performance.now() - start > 3) return;
        }

        if (changes & ChangeHandler.slides) {
            if (updateSlides())
                changes ^= ChangeHandler.slides;
            if (changes === 0 || performance.now() - start > 3) return;
        }
        if (changes & ChangeHandler.story) {
            if (updateStory())
                changes ^= ChangeHandler.story;
            if (changes === 0 || performance.now() - start > 3) return;
        }

        // wait for product info to load before showing details
        if (changes & ChangeHandler.product) {
            if (updateProductDetails())
                changes ^= ChangeHandler.product;
            if (changes === 0 || performance.now() - start > 3) return;
        } else if (changes & ChangeHandler.lift) {
            if (updateLift())
                changes ^= ChangeHandler.lift;
            if (changes === 0 || performance.now() - start > 3) return;
        }

        // these shouldn't need updates at the same time
        if (changes & ChangeHandler.page) {
            if (updateContent())
                changes ^= ChangeHandler.page;
            if (changes === 0 || performance.now() - start > 3) return;
        } else if (changes & ChangeHandler.contact) {
            if (updateContact())
                changes ^= ChangeHandler.contact;
            if (changes === 0 || performance.now() - start > 3) return;
        }
    }
}

requestAnimationFrame(animate);
