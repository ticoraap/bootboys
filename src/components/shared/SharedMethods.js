export default class sharedMethods {
    static applicationTypeJSON = 'application/json'
    static sendMethodPOST = 'POST'
    static sendMethodGET = 'GET'
    static sendMethodDELETE = 'DELETE'

    static getURL(path) {
        return '' + process.env.REACT_APP_BASE_URL + path + ".json";
    }

    static stringifyData(data) {
        return JSON.stringify(data);
    }

    static parseJSON(json){
        return JSON.parse(json)
    }

    static generateRandomString = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    static validateEmail(email) {
        if (this.validateEmailInputted(email)) {
            const regex = this.createRegex('^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$')
            return this.testRegex(regex, email)
        } else return false
    }

    static validateEmailInputted(email) {
        return this.variableIsNotEmptyOrNull(email)
    }

    static validatePhoneLength(phoneNumber) {
        return phoneNumber.length > 8 && phoneNumber.length < 16;
    }

    static validatePhoneInputted(phoneNumber) {
        return this.variableIsNotEmptyOrNull(phoneNumber)
    }

    static variableIsNotEmptyOrNull(variable){
        return variable !== '' || variable !== null;
    }

    static validatePhone(phoneNumber) {
        if (this.validatePhoneInputted(phoneNumber)) {
            if (this.validatePhoneLength(phoneNumber)) {
                const regex = this.createRegex('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$')
                return this.testRegex(regex, phoneNumber)
            }
        }
        return false;
    }

    static createRegex(regex) {
        return new RegExp(regex)
    }

    static testRegex(regex, testString) {
        return regex.test(testString)
    }
}
