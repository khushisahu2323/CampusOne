import { ErrorMessage } from "../error/error.js";

export function Input({

    label = "",

    type = "text",

    placeholder = "",

    id = "",

    icon = "",

    rightIcon = "",

    errorId = ""

}) {

    return `

        <div class="input-group">

            <label
                class="input-label"
                for="${id}"
            >

                ${label}

            </label>

            <div class="input-wrapper">

                ${
                    icon
                        ? `
                            <span class="input-icon">

                                ${icon}

                            </span>
                        `
                        : ""
                }

                <input

                    id="${id}"

                    type="${type}"

                    class="input"

                    placeholder="${placeholder}"

                    autocomplete="off"

                >

                ${
                    rightIcon
                        ? `
                            <button
                                type="button"
                                class="input-action"
                                data-toggle="${id}"
                                aria-label="Toggle Password"
                            >

                                ${rightIcon}

                            </button>
                        `
                        : ""
                }

            </div>

            ${ErrorMessage({

                id: errorId,

                message: ""

            })}

        </div>

    `;

}