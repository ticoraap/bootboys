import {authenticationService} from "./authentication.service";

export function authHeader() {
    const currentUser = authenticationService.currentUserValue;
    const headers = {
        'Authorization': ''
    }
    if (currentUser && currentUser.token) {
        headers['Authorization'] = currentUser.token
        return headers
    } else {
        return headers
    }

}

export function authHeaderToken() {
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
        return currentUser.token
    } else {
        return ''
    }
}
