import axios from "axios";
import { getAuthToken, getUserId } from "../shared/utility";

// REFACTOR make a interface for API clients like httpClient
export const httpClient = {
    getDock,
    getAllDocks,
    addDock,
    removeDock,

    addUserDock,
    getUserDocks,
    removeUserDock,

    getAddress,
    addAddress,
    getAddressesFromUser,
};

function getAllDocks() {
    return get("dock");
}

function addDock(id, dock) {
    return put("dock/" + id, dock);
}

function getDock(dockid) {
    return getWithAuthToken("dock/" + dockid);
}

function removeDock(dockid) {
    return remove("dock/" + dockid);
}

function addUserDock(dock) {
    const userId = getUserId();
    const userDock = {
        addressid: dock.addressid,
        name: dock.name,
        description: dock.description,
        numfacilities: dock.facilities.length,
        price: dock.price,
        latitude: dock.latitude,
        longitude: dock.longitude,
        length: dock.length,
        width: dock.width,
    };

    return post("users/" + userId + "/userDocks", userDock);
}

function getUserDocks() {
    const userId = getUserId();
    return getWithAuthToken("users/" + userId + "/userDocks");
}

function removeUserDock(dockid) {
    const userId = getUserId();
    return remove("users/" + userId + "/userDocks/" + dockid);
}

function getAddress(addressid) {
    return getWithAuthToken("address/" + addressid);
}

function getAddressesFromUser() {
    return getWithAuthToken("address");
}

function addAddress(address) {
    return post("address", address);
}

function post(url, JSON) {
    const URL = composeApiURLWithAuth(url);
    return axios.post(URL, JSON);
}

function put(url, dock) {
    dock.userid = getUserId();
    const URL = composeApiURLWithAuth(url);
    return axios.put(URL, dock);
}

function get(resourceLocation) {
    const URL = composeApiURL(resourceLocation);
    return axios.get(URL);
}

function getWithAuthToken(resourceLocation) {
    const URL = composeApiURLWithAuth(resourceLocation);
    return axios.get(URL);
}

function remove(resourceLocation) {
    const URL = composeApiURLWithAuth(resourceLocation);
    return axios.delete(URL);
}

function composeApiURL(resourceLocation) {
    return getBaseURL() + resourceLocation + ".json";
}

function composeApiURLWithAuth(resourceLocation) {
    return getBaseURL() + resourceLocation + ".json" + getAuthString();
}

function getAuthString() {
    if (getAuthToken()) return "?auth=" + getAuthToken();
    return "";
}

function getBaseURL() {
    return "" + process.env.REACT_APP_BASE_URL;
}

export default httpClient;
