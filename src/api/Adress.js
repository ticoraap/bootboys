export function getAddressApi(httpService) {

    function get(addressid) {
        return httpService.getAddress(addressid)
    }

    function getAllFromUser() {
        return httpService.getAddressesFromUser();
    }

    function add(address) {
        return httpService.addAddress(address);
    }

    return Object.freeze({ get, getAllFromUser, add });
}
