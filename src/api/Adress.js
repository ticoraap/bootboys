export function AddressApi(httpClient) {
    function get(addressid) {
        return httpClient.getAddress(addressid);
    }

    function getAllFromUser() {
        return httpClient.getAddressesFromUser();
    }

    function add(address) {
        return httpClient.addAddress(address);
    }

    return Object.freeze({ get, getAllFromUser, add });
}
