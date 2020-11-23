import {BehaviorSubject} from "rxjs";
import {handleResponse} from "./handle-response";
import {ApiService} from "../shared/Api.service";
import sharedMethods from "../shared/SharedMethods";

const currentUserSubject = new BehaviorSubject(sharedMethods.parseJSON(localStorage.getItem('currentUser')))

export const authenticationService = {
    login,
    logout,
    checkIfLoggedIn,

    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() {
        return currentUserSubject.value
    }
}

function login(username, password) {
    return ApiService.post('/trylogin', {username, password}).then(handleResponse).then(user => {
        localStorage.setItem('currentUser', JSON.stringify(user['user']))
        currentUserSubject.next(user['user'])
    })
}

function logout() {
    localStorage.setItem('goToHome', 'true');
    localStorage.removeItem('currentUser');
}

function checkIfLoggedIn(){
    return localStorage.getItem("currentUser") !== null
}