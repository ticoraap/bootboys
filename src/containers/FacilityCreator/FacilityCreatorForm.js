export const facilityCreatorForm = {
    description: {
        styling: {
            width: "100%"
        },
        label: 'Description',
        elementType: 'textArea',
        elementConfig: {
            type: 'text',
            placeholder: 'Describe the facility you offer:'
        },
        value: '',
        validationWarning: "Please enter a description not greater then 500 chars",
        validationRules: {
            required: true,
            maxLength: 500
        },
        valid: false,
        touched: false
    },
    price: {
        styling: {
            width: "40%"
        },
        label: 'Price',
        elementType: 'input',
        elementConfig: {
            type: 'text',
            placeholder: 'Example: 25 or €29,99'
        },
        value: '',
        validationWarning: "Please enter a price in euros Example: 25 or €29,99",
        validationRules: {
            required: true,
            isEuros: true
        },
        valid: false,
        touched: false
    },
    saveFacility: {
        elementType: 'saveFacilityButton',
    },
}