import * as actionTypes from "../actions/actionTypes";
import ToastMaker from "../../components/shared/ToastMaker";
import * as actions from "./index";
import axios from "axios";

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
                dispatch({
                    type: actionTypes.AUTH_SUCCESS,
                    idToken: response.data.idToken,
                    localId: response.data.localId,
                });
            })
            .catch((error) => {
                dispatch({
                    type: actionTypes.AUTH_FAIL,
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
                dispatch({
                    type: actionTypes.AUTH_SUCCESS,
                    idToken: token,
                    localId: userId,
                });
            } else {
                dispatch({ type: actionTypes.AUTH_LOGOUT });
            }
        }
    };
};

export const loginUser = () => {
    return (dispatch) => {
        dispatch({ type: actionTypes.LOGIN_USER });
        dispatch(actions.getUserDocks());
    };
};

export const logoutUser = (history) => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
    ToastMaker.infoToast("Successfully logged out");
    history.push("/");
    return {
        type: actionTypes.AUTH_LOGOUT,
    };
};
