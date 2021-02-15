import * as actionTypes from "../actions/actionTypes";
import axios from "axios";
import ToastMaker from "../../shared/toastMaker";

export const auth = (email, password) => {
    return (dispatch) => {
        dispatch({ type: actionTypes.AUTH_START });
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true,
        };
        let url =
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAl0fk3HD9M8a88_drLlhXsEYJM-aTUVYA";
        axios
            .post(url, authData)
            .then((response) => {
                const expirationDate = new Date(
                    new Date().getTime() + response.data.expiresIn * 1000
                );
                localStorage.setItem("token", response.data.idToken);
                localStorage.setItem("expirationDate", expirationDate);
                localStorage.setItem("userId", response.data.localId);
                localStorage.setItem("email", response.data.email);
                localStorage.setItem("name", response.data.displayName);
                dispatch({
                    type: actionTypes.AUTH_SUCCESS,
                    idToken: response.data.idToken,
                    localId: response.data.localId,
                    email: response.data.email,
                    name: response.data.displayName,
                });
                dispatch({ type: actionTypes.TOGGLE_LOGIN_MODAL });
                ToastMaker.infoToast("Logged in as " + response.data.email);
            })
            .catch((error) => {
                dispatch({
                    type: actionTypes.AUTH_FAIL,
                    error: error,
                });
            });
    };
};

export const authCheckState = () => {
    return (dispatch) => {
        const token = localStorage.getItem("token");
        if (!token) {
            dispatch({ type: actionTypes.AUTH_LOGOUT });
        } else {
            const expirationDate = new Date(
                localStorage.getItem("expirationDate")
            );
            if (expirationDate > new Date()) {
                const userId = localStorage.getItem("userId");
                const email = localStorage.getItem("email");
                const name = localStorage.getItem("name");
                ToastMaker.infoToast("Logged in as " + email);
                dispatch({
                    type: actionTypes.AUTH_SUCCESS,
                    idToken: token,
                    localId: userId,
                    email: email,
                    name: name,
                });
            } else {
                dispatch(logoutUser());
            }
        }
    };
};

export const logoutUser = (history) => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    ToastMaker.infoToast("Logged out");
    if (history) {
        history.push("/");
    }
    return {
        type: actionTypes.AUTH_LOGOUT,
    };
};

export const changePassword = (newPassword, token) => {
    return (dispatch) => {
        dispatch({ type: actionTypes.AUTH_CHANGE_PASSWORD_START });
        const url =
            "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAl0fk3HD9M8a88_drLlhXsEYJM-aTUVYA";
        const changePasswordPayload = {
            idToken: token,
            password: newPassword,
        };
        axios
            .post(url, changePasswordPayload)
            .then((response) => {
                dispatch({
                    type: actionTypes.AUTH_CHANGE_PASSWORD_SUCCESS,
                    email: response.email,
                });
            })
            .catch((error) => {
                dispatch({
                    type: actionTypes.AUTH_CHANGE_PASSWORD_FAIL,
                    error: error,
                });
            });
    };
};

export const createAccount = (email, password) => {
    return (dispatch) => {
        dispatch({ type: actionTypes.AUTH_CREATE_ACCOUNT_START });
        const url =
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAl0fk3HD9M8a88_drLlhXsEYJM-aTUVYA";
        const createPasswordPayload = {
            email: email,
            password: password,
        };

        axios
            .post(url, createPasswordPayload)
            .then((response) => {
                const expirationDate = new Date(
                    new Date().getTime() + response.data.expiresIn * 1000
                );
                localStorage.setItem("token", response.data.idToken);
                localStorage.setItem("expirationDate", expirationDate);
                localStorage.setItem("email", email);
                ToastMaker.infoToast("Created New Account");
          
                dispatch({
                    type: actionTypes.AUTH_CREATE_ACCOUNT_SUCCESS,
                });
                dispatch({ type: actionTypes.TOGGLE_REGISTER_MODAL });
            })
            .catch((error) => {
                dispatch({
                    type: actionTypes.AUTH_CHANGE_PASSWORD_FAIL,
                    error: error,
                });
            });
    };
};
