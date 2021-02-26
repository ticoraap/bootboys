import countryCodes from "./countryCodes";
import stateCodes from "./stateCodes";

export const addressForm = {
    street: {
        styling: {
            width: "80%",
        },
        label: "Street",
        elementType: "input",
        elementConfig: {
            type: "text",
        },
        value: "",
        validationRules: {
            required: true,
            maxLength: 100,
        },
        validationWarning: "*required",
        valid: false,
        touched: false,
    },
    houseNumber: {
        styling: {
            width: "20%",
        },
        label: "Number",
        elementType: "input",
        elementConfig: {
            type: "text",
        },
        value: "",
        validationRules: {
            required: true,
            maxLength: 100,
        },
        validationWarning: "*required",
        valid: false,
        touched: false,
    },
    postalcode: {
        styling: {
            width: "50%",
        },
        label: "Postal code",
        elementType: "input",
        elementConfig: {
            type: "text",
        },
        value: "",
        validationRules: {
            required: true,
            isPostalcode: true,
        },
        valid: false,
        touched: false,
    },
    city: {
        styling: {
            width: "50%",
        },
        label: "City",
        elementType: "input",
        elementConfig: {
            type: "text",
        },
        value: "",
        validationRules: {
            required: true,
        },
        valid: false,
        touched: false,
    },
    country: {
        styling: {
            width: "50%",
        },
        label: "Country",
        elementType: "select",
        elementConfig: {
            options: countryCodes(),
        },
        value: "NL",
        validationRules: {
            required: true,
        },
        valid: true,
        touched: true,
    },
    state: {
        styling: {
            width: "50%",
        },
        label: "US State",
        elementType: "select",
        elementConfig: {
            options: stateCodes(),
            placeholder: "Select a State",
        },
        value: "",
        validationRules: {
            required: true,
        },
        valid: true,
        touched: true,
    },
}