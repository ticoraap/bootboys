import * as actionTypes from "../actions/actionTypes";

const initialState = {
    token: null,
    userId: null,
    email: "",
    name: "",
    error: null,
    loading: false,
    loadingPasswordChange: false,
    loadingCreatingAccount: false,
    newAccountCreated: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START:
            return {
                ...state,
                loading: true,
            };
        case actionTypes.AUTH_SUCCESS:
            return {
                ...state,
                loading: false,
                token: action.idToken,
                userId: action.localId,
                email: action.email,
                name: action.name
            };
        case actionTypes.AUTH_FAIL:
            return {
                ...state,
                loading: false,
            };
        case actionTypes.AUTH_LOGOUT:
            return {
                ...state,
                token: null,
                userId: null,
                email: "",
                name: "",
                error: null,
                loading: false,
            };
        case actionTypes.LOGIN_USER:
            return {
                ...state,
                isAuthenticated: true,
            };
        case actionTypes.LOGOUT_USER:
            return {
                ...state,
                isAuthenticated: false,
            };
        case actionTypes.AUTH_CHANGE_PASSWORD_START:
            return {
                ...state,
                loadingPasswordChange: true,
            };
        case actionTypes.AUTH_CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                loadingPasswordChange: false,
            };
        case actionTypes.AUTH_CHANGE_PASSWORD_FAIL:
            return {
                ...state,
                loadingPasswordChange: false,
            };
        case actionTypes.AUTH_CREATE_ACCOUNT_START:
            return {
                ...state,
                loadingCreatingAccount: true,
            };
        case actionTypes.AUTH_CREATE_ACCOUNT_FAIL:
            return {
                ...state,
                loadingCreatingAccount: false,
            };
        case actionTypes.AUTH_CREATE_ACCOUNT_SUCCESS:
            return {
                ...state,
                loadingCreatingAccount: false,
                newAccountCreated: true
            };
        default:
            return state;
    }
};

export default reducer;
