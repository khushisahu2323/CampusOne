import { Background } from "../../components/background/background.js";
import { Button } from "../../components/button/button.js";
import { Input } from "../../components/input/input.js";
import { Link } from "../../components/link/link.js";

import {
    BuildingIcon,
    MailIcon
} from "../../components/icons/index.js";


export function ForgotPasswordPage() {

    return `

        ${Background()}

        <section class="login">

            <div class="login-hero">

                <img
                    src="/CampusOne/logo/logo.png"
                    alt="CampusOne Logo"
                    class="login-logo"
                >

                <h1 class="login-title">

                    CampusOne

                </h1>

                <p class="login-tagline">

                    One Platform. Every Institution.

                </p>

                <div class="hero-greeting">

                    <h2 class="live-greeting">

                        Reset Password

                    </h2>

                    <p class="hero-subtitle">

                        Enter your institution code and email,
                        we'll send you a link to reset your password.

                    </p>

                </div>

            </div>

            <div class="auth-card">

                <div id="forgotPasswordForm">

                    ${Input({

                        label: "Institution Code",

                        id: "institution",

                        placeholder: "Enter institution code",

                        icon: BuildingIcon(),

                        errorId: "institutionError"

                    })}

                    ${Input({

                        label: "Email Address",

                        type: "email",

                        id: "email",

                        placeholder: "Enter your email",

                        icon: MailIcon(),

                        errorId: "emailError"

                    })}

                    ${Button({

                        text: "Send Reset Link",

                        id: "resetButton",

                        type: "button",

                        variant: "primary"

                    })}

                </div>

                <div
                    id="resetSuccess"
                    class="reset-success"
                    style="display:none;"
                >

                    <p class="reset-success-title">

                        Check your inbox 📩

                    </p>

                    <p class="reset-success-text">

                        We've sent a password reset link to your
                        email address. It may take a few minutes
                        to arrive — please check spam too.

                    </p>

                </div>

                <div class="login-register">

                    ${Link({

                        text: "← Back to Login",

                        id: "backToLogin"

                    })}

                </div>

            </div>

        </section>

    `;

}
