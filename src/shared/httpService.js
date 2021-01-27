import { authHeaderToken } from "../components/LoginComponent/auth-header";

const applicationTypeJSON = "application/json";
const httpMethodPOST = "POST";
const httpMethodGET = "GET";
const httpMethodDELETE = "DELETE";

export const httpService = {
    getAllDocks,
    addDock,
    removeDock,
    addAddress,
    getAddressesFromUser
};

function getAllDocks() {
    return getJson("dock");
}

function addDock(dock){
    return post("dock", dock)
}

function removeDock(dockid){
    return remove("dock/", dockid)
}

function getAddressesFromUser(){
    return getJson("address")
}

function addAddress(address){
    return post("address", address)
}

function post(url, JSON) {
    const URL = composeApiURL(url);

    return fetch(URL, {
        method: httpMethodPOST,
        body: stringifyData(JSON),
        headers: {
            "Content-Type": applicationTypeJSON,
            Authorization: authHeaderToken(),
        },
    });
}

function get(resourceLocation) {
    const URL = composeApiURL(resourceLocation);
    return fetch(URL, {
        method: httpMethodGET,
        headers: {
            Authorization: authHeaderToken(),
        },
    });
}

function remove(resourceLocation) {
    const URL = composeApiURL(resourceLocation);
    return fetch(URL, {
        method: httpMethodDELETE,
        headers: {
            Authorization: authHeaderToken(),
        },
    });
}

function getJson(resourceLocation) {
    return new Promise((resolve, reject) => {
        get(resourceLocation)
            .then((response) => {
                response
                    .json()
                    .then((json) => {
                        resolve(json);
                    })
                    .catch((error) => reject(error));
            })
            .catch((error) => reject(error));
    });
}

const composeApiURL = (resourceLocation) => {
    return getBaseURL() + resourceLocation + ".json";
};

const getBaseURL = () => {
    return "" + process.env.REACT_APP_BASE_URL;
};

const stringifyData = (data) => {
    return JSON.stringify(data);
};

export default httpService;
