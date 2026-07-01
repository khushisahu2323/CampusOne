import {

    validateInstitutionInfoStep

} from "../validation/registerInstitutionValidation.js";

import { generateInstitutionCode } from "../utils/institutionCode.js";

/* =========================================
   Error Helpers
   (same convention as login.js / register.js)
========================================= */

function clearErrors() {

    document
        .querySelectorAll(".error-message")
        .forEach((error) => {

            error.textContent = "";

            error.classList.remove("show");

        });

}

function showError(id, message) {

    const error =
        document.getElementById(id);

    if (!error) return;

    error.textContent = message;

    error.classList.add("show");

    const input =
        document.getElementById(
            id.replace("Error", "")
        );

    if (input) {

        input.classList.remove("success");

        input.classList.add("error");

        input.focus();

    }

}

function showSuccess(id) {

    const input =
        document.getElementById(id);

    if (!input) return;

    input.classList.remove("error");

    input.classList.add("success");

}

function resetValidation() {

    document
        .querySelectorAll(".input")
        .forEach((input) => {

            input.classList.remove(

                "error",

                "success"

            );

        });

}

/* =========================================
   Step Navigation
   (shared state the later steps will also
   use — kept minimal for now)
========================================= */

const wizardState = {

    currentStep: 1,

    totalSteps: 6

};

function goToStep(stepNumber) {

    document

        .querySelectorAll(".ri-panel")

        .forEach((panel) => {

            panel.classList.toggle(

                "active",

                Number(panel.dataset.step) === stepNumber

            );

        });

    document

        .querySelectorAll(".ri-step")

        .forEach((step) => {

            const stepNum = Number(step.dataset.step);

            step.classList.toggle(

                "active",

                stepNum === stepNumber

            );

            step.classList.toggle(

                "completed",

                stepNum < stepNumber

            );

        });

    wizardState.currentStep = stepNumber;

    window.scrollTo({ top: 0, behavior: "smooth" });

}

/* =========================================
   Step 1 — Institution Information
========================================= */

function setupStep1() {

    const nameInput =
        document.getElementById("institutionName");

    const codeInput =
        document.getElementById("institutionCode");

    const typeSelect =
        document.getElementById("institutionType");

    const yearInput =
        document.getElementById("establishedYear");

    const nextButton =
        document.getElementById("riNextStep1");

    // Live-generate the institution code as the
    // user types the name. Regenerated on every
    // keystroke for now — final code is locked in
    // once the user proceeds past this step.

    if (nameInput && codeInput) {

        nameInput.addEventListener("input", () => {

            codeInput.value = generateInstitutionCode(

                nameInput.value

            );

        });

    }

    if (!nextButton) return;

    nextButton.addEventListener("click", () => {

        clearErrors();

        resetValidation();

        const institutionName =
            nameInput ? nameInput.value.trim() : "";

        const institutionType =
            typeSelect ? typeSelect.value : "";

        const establishedYear =
            yearInput ? yearInput.value.trim() : "";

        const result = validateInstitutionInfoStep({

            institutionName,

            institutionType,

            establishedYear

        });

        if (!result.valid) {

            showError(

                `${result.field}Error`,

                result.message

            );

            return;

        }

        showSuccess("institutionName");

        showSuccess("institutionType");

        if (establishedYear) {

            showSuccess("establishedYear");

        }

        // Institution code is finalised on leaving
        // Step 1 — later steps and the submit
        // handler will read it via
        // document.getElementById("institutionCode").value

        goToStep(2);

    });

}

/* =========================================
   Init
========================================= */

export function initRegisterInstitution() {

    setupStep1();

    // Steps 2-6 will call their own setupStepN()
    // functions here as they're built.

}
