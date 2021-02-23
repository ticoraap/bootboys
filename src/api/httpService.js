import axios from "axios";
import { getAuthToken, getUserId } from "../shared/utility";

export const httpService = {
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

// docks
function getAllDocks() {
    return get("dock");
}

function addDock(id, dock) {
    return put("dock/" + id, dock);
}

function getDock(dockid) {
    return get("dock/" + dockid);
}

function removeDock(dockid) {
    return remove("dock/" + dockid);
}

// user
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
        width: dock.width
    };

    return post("users/" + userId + "/userDocks", userDock);
}

function getUserDocks() {
    const userId = getUserId();
    return get("users/" + userId + "/userDocks")
}

function removeUserDock(dockid) {
    const userId = getUserId();
    return remove("users/" + userId + "/userDocks/" + dockid)
}

// address
function getAddress(addressid) {
    return get("address/" + addressid);
}

function getAddressesFromUser() {
    return get("address");
}

function addAddress(address) {
    return post("address", address);
}



// http functions
function post(url, JSON) {
    const URL = composeApiURL(url);
    return axios.post(URL, JSON);
}

function put(url, dock) {
    dock.userid = getUserId()
    const URL = composeApiURL(url);
    return axios.put(URL, dock);
}

function get(resourceLocation) {
    const URL = composeApiURL(resourceLocation);
    return axios.get(URL)
}

function remove(resourceLocation) {
    const URL = composeApiURL(resourceLocation);
    return axios.delete(URL)
}


const composeApiURL = (resourceLocation) => {
    return getBaseURL() + resourceLocation + ".json" + getAuthString();
};

const getAuthString = () => {
    if (getAuthToken()) return "?auth=" + getAuthToken();
    return "";
};

const getBaseURL = () => {
    return "" + process.env.REACT_APP_BASE_URL;
};


export default httpService;
