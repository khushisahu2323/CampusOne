import { Background } from "../../components/background/background.js";
import { Input } from "../../components/input/input.js";
import { Select } from "../../components/select/select.js";
import { Button } from "../../components/button/button.js";

import {

    BuildingIcon,

    MailIcon

} from "../../components/icons/index.js";


const INSTITUTION_TYPE_OPTIONS = [

    { value: "school", label: "School" },

    { value: "college", label: "College" },

    { value: "university", label: "University" },

    { value: "coaching", label: "Coaching Institute" },

    { value: "training-center", label: "Training Center" },

    { value: "other", label: "Other" }

];


export function RegisterInstitutionPage() {

    return `

        ${Background()}

        <section class="register-institution">

            <div class="ri-hero">

                <img
                    src="assets/logo/logo.png"
                    alt="CampusOne Logo"
                    class="login-logo"
                >

                <h1 class="login-title">

                    CampusOne

                </h1>

                <p class="ri-subtitle">

                    Register your institution and get started
                    in a few simple steps.

                </p>

            </div>

            <div class="auth-card ri-card">

                <!-- Step Indicator -->

                <div
                    class="ri-steps"
                    id="riSteps"
                >

                    ${[

                        "Institution",

                        "Contact",

                        "Address",

                        "Admin",

                        "Logo",

                        "Agreement"

                    ]

                        .map(

                            (label, index) => `

                                <div
                                    class="ri-step ${index === 0 ? "active" : ""}"
                                    data-step="${index + 1}"
                                >

                                    <span class="ri-step-dot">

                                        ${index + 1}

                                    </span>

                                    <span class="ri-step-label">

                                        ${label}

                                    </span>

                                </div>

                            `

                        )

                        .join("")}

                </div>

                <form id="registerInstitutionForm">

                    <!-- ===================================
                         Step 1 — Institution Information
                    =================================== -->

                    <div
                        class="ri-panel active"
                        data-panel="1"
                    >

                        <h2 class="ri-panel-title">

                            Institution Information

                        </h2>

                        ${Input({

                            label: "Institution Name *",

                            id: "institutionName",

                            placeholder: "e.g. Sarla Birla University",

                            icon: BuildingIcon(),

                            errorId: "institutionNameError"

                        })}

                        ${Input({

                            label: "Institution Code",

                            id: "institutionCode",

                            placeholder: "Auto generated",

                            icon: BuildingIcon(),

                            errorId: "institutionCodeError",

                            readonly: true,

                            hint: "Generated automatically from the institution name."

                        })}

                        ${Select({

                            label: "Institution Type *",

                            id: "institutionType",

                            icon: BuildingIcon(),

                            errorId: "institutionTypeError",

                            placeholder: "Select institution type",

                            options: INSTITUTION_TYPE_OPTIONS

                        })}

                        ${Input({

                            label: "Established Year (Optional)",

                            id: "establishedYear",

                            type: "number",

                            placeholder: "e.g. 1998",

                            icon: MailIcon(),

                            errorId: "establishedYearError"

                        })}

                        <div class="ri-actions">

                            <span></span>

                            ${Button({

                                text: "Next",

                                id: "riNextStep1",

                                type: "button",

                                variant: "primary"

                            })}

                        </div>

                    </div>

                    <!-- Steps 2-6 render here in later builds -->

                </form>

            </div>

        </section>

    `;

}
