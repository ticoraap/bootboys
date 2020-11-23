import sharedMethods from "./SharedMethods";
import {authHeaderToken} from "../LoginComponent/auth-header";

export const ApiService = {
    post,
    put,
    get,
    getJson,
    remove
}

function post(url, JSON) {
    const fullUrl = sharedMethods.getURL(url)

    return fetch(fullUrl, {
        method: sharedMethods.sendMethodPOST,
        body: sharedMethods.stringifyData(JSON),
        headers: {
            'Content-Type': sharedMethods.applicationTypeJSON,
            'Authorization': authHeaderToken()
        }
    })
}

function put() {

}

function get(url) {
    const fullUrl = sharedMethods.getURL(url)

    return fetch(fullUrl, {
        method: sharedMethods.sendMethodGET,
        headers: {
            'Authorization': authHeaderToken()
        }
    })
}

function getJson(url) {
    return new Promise((resolve, reject) => {
        const fullUrl = sharedMethods.getURL(url)

        fetch(fullUrl, {
            method: sharedMethods.sendMethodGET,
            headers: {
                'Authorization': authHeaderToken()
            }
        })
            .then(response => {
                response.json().then(json => {
                    resolve(json)
                })
                    .catch(error => reject(error))
            })
            .catch(error => reject(error))
    })
}

function remove(url) {
    const fullUrl = sharedMethods.getURL(url)

    return fetch(fullUrl, {
        method: sharedMethods.sendMethodDELETE,
        headers: {
            'Authorization': authHeaderToken()
        }
    })

}

export default ApiService
