export const dockCreatorForm = {
    name: {
        wrapperClassName: "WrapperclassFull",
        label: "Title/Name of the Dock",
        elementType: "input",
        elementConfig: {
            type: "text",
            placeholder: "Title/Name of the Dock",
        },
        value: "",
        validationWarning:
            "Please enter a Title/Name not greater then 80 chars",
        validationRules: {
            required: true,
            maxLength: 80,
        },
        valid: false,
        touched: false,
    },
    address: {
        wrapperClassName: "Wrapperclass35",
        label: "Address",
        elementType: "select",
        elementConfig: {
            options: [],
            placeholder: "Select a address",
            emptyPlaceholder: "Please add a new address",
        },
        value: "",
        validationWarning: "Please choose a address or create a new",
        validationRules: {
            required: true,
        },
        valid: false,
        touched: false,
    },
    description: {
        wrapperClassName: "WrapperclassFull",
        label: "Description of the Dock",
        elementType: "textArea",
        elementConfig: {
            type: "text",
            placeholder: "A safe dock 300m from the nearest trainstation...",
        },
        value: "",
        validationWarning:
            "Please enter a short description max 500 characters",
        validationRules: {
            required: true,
            maxLength: 500,
        },
        valid: false,
        touched: false,
    },
    facilityCreator: {
        wrapperClassName: "WrapperclassFull",
        label: "Add/Remove Facility's",
        elementType: "passChildElement",
    },
    length: {
        wrapperClassName: "WrapperclassFull",
        label: "Length of the dock",
        elementType: "input",
        elementConfig: {
            type: "text",
            placeholder: "Length in meters",
        },
        value: "",
        validationWarning: "This field is required",
        validationRules: {
            required: true,
            isMeters: true,
        },
        valid: false,
        touched: false,
    },
    width: {
        wrapperClassName: "WrapperclassFull",
        label: "Width of the dock",
        elementType: "input",
        elementConfig: {
            type: "text",
            placeholder: "Width in meters",
        },
        value: "",
        validationRules: {
            required: true,
            isMeters: true,
        },
        valid: false,
        touched: false,
    },
    price: {
        wrapperClassName: "WrapperclassFull",
        label: "Price in euros per night",
        elementType: "input",
        elementConfig: {
            type: "text",
            placeholder: "Example: 25 or €29,99",
        },
        value: "",
        validationWarning: "Price in euros Example: 25 or €29,99",
        validationRules: {
            required: true,
            isEuros: true,
        },
        valid: false,
        touched: false,
    },
    place: {
        wrapperClassName: "WrapperclassFull",
        label: "Label for place",
        elementType: "input",
        elementConfig: {
            type: "text",
            placeholder: "Example: A or C12",
        },
        value: "",
        validationRules: {
            required: false,
        },
        valid: true,
        touched: false,
    },
    latitude: {
        wrapperClassName: "Wrapperclass35",
        label: "Latitude",
        elementType: "input",
        elementConfig: {
            type: "text",
            placeholder: "Latitude",
            disabled: true,
        },
        value: "",
        validationRules: {
            required: true,
            isLatitude: true,
        },
        valid: false,
        touched: false,
    },
    longitude: {
        wrapperClassName: "Wrapperclass35",
        label: "Longitude",
        elementType: "input",
        elementConfig: {
            type: "text",
            placeholder: "Longitude",
            disabled: true,
        },
        value: "",
        validationRules: {
            required: true,
            isLongitude: true,
        },
        valid: false,
        touched: false,
    },
};
