import {
    EyeIcon,
    EyeOffIcon
} from "../../components/icons/index.js";

import {
    validateRegisterForm
} from "../validation/index.js";

import {
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    auth,
    googleProvider
} from "../firebase.js";

import {
    navigate
} from "../router.js";


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

    text = "Create Account"

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
   Map field name -> error element id
========================================= */

function getErrorIdForMessage(message) {

    const institutionMessages = [
        "Institution code is required.",
        "Institution code is too short.",
        "Institution code is too long.",
        "Only letters, numbers, '-' and '_' are allowed."
    ];

    const nameMessages = [
        "Full name is required.",
        "Full name is too short.",
        "Full name is too long.",
        "Only letters and spaces are allowed."
    ];

    const emailMessages = [
        "Email is required.",
        "Enter a valid email address."
    ];

    const confirmPasswordMessages = [
        "Please confirm your password.",
        "Passwords do not match."
    ];

    if (institutionMessages.includes(message)) {

        return "institutionError";

    }

    if (nameMessages.includes(message)) {

        return "nameError";

    }

    if (emailMessages.includes(message)) {

        return "emailError";

    }

    if (confirmPasswordMessages.includes(message)) {

        return "confirmPasswordError";

    }

    // Anything left over is a password-strength
    // message coming from validatePassword().

    return "passwordError";

}

/* =========================================
   Firebase Error Mapping
========================================= */

function mapRegisterError(error) {

    switch (error.code) {

        case "auth/email-already-in-use":

            return {
                id: "emailError",
                message: "Email already exists."
            };

        case "auth/invalid-email":

            return {
                id: "emailError",
                message: "Invalid email address."
            };

        case "auth/weak-password":

            return {
                id: "passwordError",
                message: "Password is too weak."
            };

        case "auth/network-request-failed":

            return {
                id: "passwordError",
                message: "Network error. Check your connection."
            };

        default:

            return {
                id: "passwordError",
                message: error.message
            };

    }

}

/* =========================================
   Password Toggle Helper
   (handles both #password and #confirmPassword)
========================================= */

function setupPasswordToggle(inputId) {

    const input =
        document.getElementById(inputId);

    const button =
        document.querySelector(
            `[data-toggle="${inputId}"]`
        );

    if (!input || !button) return;

    let visible = false;

    button.innerHTML = EyeIcon();

    button.addEventListener("click", () => {

        visible = !visible;

        input.type = visible
            ? "text"
            : "password";

        button.innerHTML = visible
            ? EyeOffIcon()
            : EyeIcon();

        button.setAttribute(
            "aria-pressed",
            String(visible)
        );

    });

}

/* =========================================
   Register
========================================= */

export function initRegister() {

    const institutionInput =
        document.getElementById("institution");

    const nameInput =
        document.getElementById("name");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const confirmPasswordInput =
        document.getElementById("confirmPassword");

    const createAccountButton =
        document.getElementById("createAccountButton");

    const googleButton =
        document.getElementById("googleRegister");

    const formWrapper =
        document.getElementById("registerForm");

    const successWrapper =
        document.getElementById("registerSuccess");

    const signInLink =
        document.getElementById("signInLink");

    const goToLoginButton =
        document.getElementById("goToLoginButton");

    /* =========================================
       Password Toggles
    ========================================= */

    setupPasswordToggle("password");

    setupPasswordToggle("confirmPassword");

    /* =========================================
       Sign In Link / Go to Login
    ========================================= */

    function goToLogin(event) {

        if (event) event.preventDefault();

        navigate("login");

    }

    if (signInLink) {

        signInLink.addEventListener(
            "click",
            goToLogin
        );

    }

    if (goToLoginButton) {

        goToLoginButton.addEventListener(
            "click",
            goToLogin
        );

    }

    /* =========================================
       Google Sign Up
    ========================================= */

    if (googleButton) {

        googleButton.addEventListener(
            "click",
            async () => {

                setButtonLoading(
                    googleButton,
                    "Signing up..."
                );

                try {

                    await signInWithPopup(

                        auth,

                        googleProvider

                    );

                    resetButton(
                        googleButton,
                        "Continue with Google"
                    );

                    alert("Account Created ✅");

                    // navigate("dashboard");

                } catch (error) {

                    resetButton(
                        googleButton,
                        "Continue with Google"
                    );

                    if (error.code === "auth/popup-closed-by-user") {

                        // User cancelled — no need to show an error.

                        return;

                    }

                    alert(
                        "Google Sign-Up failed: " +
                        error.message
                    );

                }

            }
        );

    }

    /* =========================================
       Create Account
    ========================================= */

    if (!createAccountButton) return;

    async function handleRegister() {

        clearErrors();

        resetValidation();

        const institution =
            institutionInput
                ? institutionInput.value.trim()
                : "";

        const name =
            nameInput
                ? nameInput.value.trim()
                : "";

        const email =
            emailInput
                ? emailInput.value.trim()
                : "";

        const password =
            passwordInput
                ? passwordInput.value
                : "";

        const confirmPassword =
            confirmPasswordInput
                ? confirmPasswordInput.value
                : "";

        const result =
            validateRegisterForm({

                institution,

                name,

                email,

                password,

                confirmPassword

            });

        if (!result.valid) {

            showError(
                getErrorIdForMessage(result.message),
                result.message
            );

            return;

        }

        showSuccess("institution");

        showSuccess("name");

        showSuccess("email");

        showSuccess("password");

        showSuccess("confirmPassword");

        setButtonLoading(
            createAccountButton,
            "Creating Account..."
        );

        try {

            const credential =
                await createUserWithEmailAndPassword(

                    auth,

                    email,

                    password

                );

            await updateProfile(

                credential.user,

                { displayName: name }

            );

            await sendEmailVerification(
                credential.user
            );

            resetButton(createAccountButton);

            if (formWrapper && successWrapper) {

                formWrapper.style.display = "none";

                successWrapper.style.display = "block";

            }

        } catch (error) {

            resetButton(createAccountButton);

            const mapped =
                mapRegisterError(error);

            showError(

                mapped.id,

                mapped.message

            );

        }

    }

    createAccountButton.addEventListener(
        "click",
        handleRegister
    );

    // Allow submitting with Enter key
    // from any of the five inputs.

    [
        institutionInput,
        nameInput,
        emailInput,
        passwordInput,
        confirmPasswordInput
    ]
        .filter(Boolean)
        .forEach((input) => {

            input.addEventListener("keydown", (event) => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    handleRegister();

                }

            });

        });

}
