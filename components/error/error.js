export function ErrorMessage({

    id = "",

    message = ""

}) {

    return `

        <p
            id="${id}"
            class="error-message"
        >

            ${message}

        </p>

    `;

}