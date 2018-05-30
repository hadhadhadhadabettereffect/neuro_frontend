import { ChangeHandler } from "./constants/masks";
import { updateNav } from "./nav";
import { updateContact } from "./contact";
import { updateContent,
        updateWidth } from "./content";
import { updateSlides,
        updateHeight } from "./slides";

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
        if (changes & ChangeHandler.popunder) {
            if (updateContact())
                changes ^= ChangeHandler.popunder;
        }
        else if (changes & ChangeHandler.navigation) {
            if (updateNav())
                changes ^= ChangeHandler.navigation;
        }
        else if (changes & ChangeHandler.content) {
            if (updateContent())
                changes ^= ChangeHandler.content;
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