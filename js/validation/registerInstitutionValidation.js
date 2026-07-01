/* =========================================
   Register Institution — Validation
   Step 1: Institution Information

   More step validators (Contact, Address,
   Admin, Logo, Agreement) will be appended
   here as those steps are built.
========================================= */

const INSTITUTION_TYPES = [

    "school",

    "college",

    "university",

    "coaching",

    "training-center",

    "other"

];

export function validateInstitutionName(name) {

    if (!name || !name.trim()) {

        return {

            valid: false,

            message: "Institution name is required."

        };

    }

    const trimmed = name.trim();

    if (trimmed.length < 3) {

        return {

            valid: false,

            message: "Institution name is too short."

        };

    }

    if (trimmed.length > 100) {

        return {

            valid: false,

            message: "Institution name is too long."

        };

    }

    return {

        valid: true,

        message: ""

    };

}

export function validateInstitutionType(type) {

    if (!type) {

        return {

            valid: false,

            message: "Please select an institution type."

        };

    }

    if (!INSTITUTION_TYPES.includes(type)) {

        return {

            valid: false,

            message: "Please select a valid institution type."

        };

    }

    return {

        valid: true,

        message: ""

    };

}

export function validateEstablishedYear(year) {

    // Optional field — empty is valid.

    if (!year) {

        return {

            valid: true,

            message: ""

        };

    }

    const currentYear = new Date().getFullYear();

    const numericYear = Number(year);

    if (

        !Number.isInteger(numericYear) ||

        numericYear < 1800 ||

        numericYear > currentYear

    ) {

        return {

            valid: false,

            message: `Enter a year between 1800 and ${currentYear}.`

        };

    }

    return {

        valid: true,

        message: ""

    };

}

export function validateInstitutionInfoStep({

    institutionName,

    institutionType,

    establishedYear

}) {

    const nameResult =
        validateInstitutionName(institutionName);

    if (!nameResult.valid) {

        return {

            ...nameResult,

            field: "institutionName"

        };

    }

    const typeResult =
        validateInstitutionType(institutionType);

    if (!typeResult.valid) {

        return {

            ...typeResult,

            field: "institutionType"

        };

    }

    const yearResult =
        validateEstablishedYear(establishedYear);

    if (!yearResult.valid) {

        return {

            ...yearResult,

            field: "establishedYear"

        };

    }

    return {

        valid: true,

        message: "",

        field: null

    };

}
