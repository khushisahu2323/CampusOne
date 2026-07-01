import {
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    auth
} from "../firebase.js";

import {
    navigate
} from "../router.js";

import {
    validateEmail
} from "../validation/email.js";

import {
    validateInstitution
} from "../validation/institution.js";


/* =========================================
   Error Helpers
========================================= */

function clearErrors() {

    document
        .querySelectorAll(".error-message")
        .forEach(error => {

            error.textContent = "";

            error.classList.remove("show");

        });

}

function resetValidation() {

    document
        .querySelectorAll(".input")
        .forEach(input => {

            input.classList.remove(
                "error",
                "success"
            );

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

/* =========================================
   Button Helpers
========================================= */

function setButtonLoading(

    button,

    text = "Please Wait..."

) {

    if (!button) return;

    button.disabled = true;

    button.classList.add("loading");

    const buttonText =
        button.querySelector(".btn-text");

    if (buttonText) {

        buttonText.textContent = text;

    }

    if (!button.querySelector(".btn-spinner")) {

        const spinner =
            document.createElement("span");

        spinner.className = "btn-spinner";

        button.appendChild(spinner);

    }

}

function resetButton(

    button,

    text = "Send Reset Link"

) {

    if (!button) return;

    button.disabled = false;

    button.classList.remove("loading");

    const buttonText =
        button.querySelector(".btn-text");

    if (buttonText) {

        buttonText.textContent = text;

    }

    const spinner =
        button.querySelector(".btn-spinner");

    if (spinner) {

        spinner.remove();

    }

}

/* =========================================
   Firebase Error Mapping
========================================= */

function mapResetError(error) {

    switch (error.code) {

        case "auth/invalid-email":

            return {
                id: "emailError",
                message: "Enter a valid email address."
            };

        case "auth/missing-email":

            return {
                id: "emailError",
                message: "Email is required."
            };

        case "auth/too-many-requests":

            return {
                id: "emailError",
                message: "Too many attempts. Please try again later."
            };

        case "auth/network-request-failed":

            return {
                id: "emailError",
                message: "Network error. Check your connection."
            };

        default:

            // Firebase deliberately does not reveal
            // "user-not-found" for password reset
            // (security best practice), so any other
            // error is shown generically.
            return {
                id: "emailError",
                message: "Something went wrong. Please try again."
            };

    }

}

/* =========================================
   Forgot Password
========================================= */

export function initForgotPassword() {

    const institutionInput =
        document.getElementById("institution");

    const emailInput =
        document.getElementById("email");

    const resetButtonEl =
        document.getElementById("resetButton");

    const formWrapper =
        document.getElementById("forgotPasswordForm");

    const successWrapper =
        document.getElementById("resetSuccess");

    const backToLogin =
        document.getElementById("backToLogin");

    if (backToLogin) {

        backToLogin.addEventListener(
            "click",
            async (event) => {

                event.preventDefault();

                navigate("login");

                const { initLogin } =
                    await import("./login.js");

                requestAnimationFrame(() => {

                    initLogin();

                });

            }
        );

    }

    if (!resetButtonEl) return;

    resetButtonEl.addEventListener(
        "click",
        async () => {

            clearErrors();

            resetValidation();

            const institution =
                institutionInput
                    ? institutionInput.value.trim()
                    : "";

            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";

            const institutionResult =
                validateInstitution(institution);

            if (!institutionResult.valid) {

                showError(
                    "institutionError",
                    institutionResult.message
                );

                return;

            }

            const emailResult =
                validateEmail(email);

            if (!emailResult.valid) {

                showError(
                    "emailError",
                    emailResult.message
                );

                return;

            }

            showSuccess("institution");

            showSuccess("email");

            setButtonLoading(resetButtonEl);

            try {

                await sendPasswordResetEmail(

                    auth,

                    email

                );

                resetButton(resetButtonEl);

                if (formWrapper && successWrapper) {

                    formWrapper.style.display = "none";

                    successWrapper.style.display = "block";

                }

            } catch (error) {

                resetButton(resetButtonEl);

                const mapped =
                    mapResetError(error);

                showError(

                    mapped.id,

                    mapped.message

                );

            }

        }
    );

}
