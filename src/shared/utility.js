export const isInputValidByRules = (input, rules) => {
    let isValid = true;

    let trimmedInput = String(input).trim();
    let trimmedInputLength = trimmedInput.length;

    if (rules) {
        if (rules.required) {
            isValid = trimmedInput !== "";
        }

        if (rules.minLength) {
            isValid = trimmedInputLength >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = trimmedInputLength <= rules.maxLength && isValid;
        }

        if (rules.isEmail) {
            const emailRegExp = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            isValid =
                emailRegExp.test(String(trimmedInput).toLowerCase()) && isValid;
        }
        if (rules.isPostalcode) {
            const postalCodeRegEx = /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i;
            isValid =
                postalCodeRegEx.test(String(trimmedInput).toLowerCase()) &&
                isValid;
        }
        if (rules.isMeters) {
            const metersRegExp = /^(\d+(?:[.,]\d{1,2})?)$/;
            isValid =
                metersRegExp.test(String(trimmedInput).toLowerCase()) &&
                isValid;
        }
        if (rules.isEuros) {
            const euroCurrencyRegExp = /^(\u20AC)?[0-9]+(,[0-9]{1,2})?$/;
            isValid =
                euroCurrencyRegExp.test(String(trimmedInput).toLowerCase()) &&
                isValid;
        }
        if (rules.isLatitude) {
            const latitudeRegExp = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,20})?))$/;
            isValid =
                latitudeRegExp.test(String(trimmedInput).toLowerCase()) &&
                isValid;
        }
        if (rules.isLongitude) {
            const longitudeRegExp = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,20})?))$/;
            isValid =
                longitudeRegExp.test(String(trimmedInput).toLowerCase()) &&
                isValid;
        }
    }
    return isValid;
};

export const objectMembersToArray = (firebaseObject, keyName = "id") => {
    const arrayOfObjects = [];
    for (const [key, value] of Object.entries(firebaseObject)) {
        value[keyName] = key;
        arrayOfObjects.push(value);
    }
    return arrayOfObjects;
};

export const parseFloatFromMetersInput = (metersInputString) => {
    return parseFloat(
        metersInputString.replace(",", ".").replace("m", "").replace("M", "")
    );
};

export const parseFloatFromEurosInput = (eurosInputString) => {
    return parseFloat(eurosInputString.replace(",", ".").replace("€", ""));
};

export const getAuthToken = () => {
    return localStorage.getItem("token");
};

export const getUserId = () => {
    return localStorage.getItem("userId");
};
