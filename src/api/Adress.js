export function getAddressApi(httpClient) {
    function getAllFromUser() {
        return httpClient.getAddressesFromUser();
    }

    function add(address) {
        return httpClient.addAddress(address);
    }

    return Object.freeze({ getAllFromUser, add });
}
