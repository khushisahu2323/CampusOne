import {
    EyeIcon,
    EyeOffIcon
} from "../../components/icons/index.js";

import {
    validateLoginForm
} from "../validation/index.js";

import {
    signInWithEmailAndPassword,
    signInWithPopup
} from "firebase/auth";

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

    text = "Continue"

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

    const emailMessages = [
        "Email is required.",
        "Enter a valid email address."
    ];

    if (institutionMessages.includes(message)) {

        return "institutionError";

    }

    if (emailMessages.includes(message)) {

        return "emailError";

    }

    return "passwordError";

}

/* =========================================
   Login
========================================= */

export function initLogin() {

    /* =========================================
       Remember Me
    ========================================= */

    const rememberMe =
        document.getElementById("rememberMe");

    const emailInput =
        document.getElementById("email");

    const institutionInput =
        document.getElementById("institution");

    const savedEmail =
        localStorage.getItem("rememberEmail");

    const savedInstitution =
        localStorage.getItem("rememberInstitution");

    if (rememberMe && emailInput && savedEmail) {

        emailInput.value = savedEmail;

        rememberMe.checked = true;

    }

    if (institutionInput && savedInstitution) {

        institutionInput.value = savedInstitution;

    }

    /* =========================================
       Password Toggle
    ========================================= */

    const passwordInput =
        document.getElementById("password");

    const passwordButton =
        document.querySelector(
            '[data-toggle="password"]'
        );

    if (passwordInput && passwordButton) {

        let visible = false;

        passwordButton.innerHTML = EyeIcon();

        passwordButton.addEventListener("click", () => {

            visible = !visible;

            passwordInput.type = visible
                ? "text"
                : "password";

            passwordButton.innerHTML = visible
                ? EyeOffIcon()
                : EyeIcon();

            passwordButton.setAttribute(
                "aria-pressed",
                String(visible)
            );

        });

    }

    /* =========================================
       Forgot Password
    ========================================= */

    const forgotPassword =
        document.getElementById("forgotPassword");

    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            async (event) => {

                event.preventDefault();

                navigate("forgot-password");

                const { initForgotPassword } =
                    await import("./forgot-password.js");

                requestAnimationFrame(() => {

                    initForgotPassword();

                });

            }
        );

    }

    /* =========================================
       Create Account
    ========================================= */

    const createAccount =
        document.getElementById("createAccount");

    if (createAccount) {

        createAccount.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                navigate("register");

            }
        );

    }

    /* =========================================
       Register Institution
    ========================================= */

    const registerInstitution =
        document.getElementById("registerInstitution");

    if (registerInstitution) {

        registerInstitution.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                navigate("register-institution");

            }
        );

    }

    /* =========================================
       Google Sign In
    ========================================= */

    const googleButton =
        document.getElementById("googleLogin");

    if (googleButton) {

        googleButton.addEventListener(
            "click",
            async () => {

                setButtonLoading(
                    googleButton,
                    "Signing in..."
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

                    alert("Login Successful ✅");

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
                        "Google Sign-In failed: " +
                        error.message
                    );

                }

            }
        );

    }

    /* =========================================
       Login
    ========================================= */

    const loginButton =
        document.getElementById("loginButton");

    if (!loginButton) return;

    async function handleLogin() {

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

        const password =
            passwordInput
                ? passwordInput.value
                : "";

        const result =
            validateLoginForm({

                institution,

                email,

                password

            });

        if (!result.valid) {

            showError(
                getErrorIdForMessage(result.message),
                result.message
            );

            return;

        }

        setButtonLoading(loginButton);

        try {

            await signInWithEmailAndPassword(

                auth,

                email,

                password

            );

            /* ==============================
               Remember Me
            ============================== */

            if (rememberMe && rememberMe.checked) {

                localStorage.setItem(
                    "rememberEmail",
                    email
                );

                localStorage.setItem(
                    "rememberInstitution",
                    institution
                );

            } else {

                localStorage.removeItem("rememberEmail");

                localStorage.removeItem("rememberInstitution");

            }

            showSuccess("institution");

            showSuccess("email");

            showSuccess("password");

            resetButton(loginButton);

            alert("Login Successful ✅");

            // navigate("dashboard");

        } catch (error) {

            resetButton(loginButton);

            switch (error.code) {

                case "auth/invalid-credential":

                    showError(
                        "passwordError",
                        "Invalid email or password."
                    );

                    break;

                case "auth/user-not-found":

                    showError(
                        "emailError",
                        "User not found."
                    );

                    break;

                case "auth/wrong-password":

                    showError(
                        "passwordError",
                        "Incorrect password."
                    );

                    break;

                case "auth/too-many-requests":

                    showError(
                        "passwordError",
                        "Too many attempts. Try again later."
                    );

                    break;

                default:

                    showError(
                        "passwordError",
                        error.message
                    );

            }

        }

    }

    loginButton.addEventListener("click", handleLogin);

    // Allow submitting with Enter key
    // from any of the three inputs.
    [institutionInput, emailInput, passwordInput]
        .filter(Boolean)
        .forEach((input) => {

            input.addEventListener("keydown", (event) => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    handleLogin();

                }

            });

        });

}
