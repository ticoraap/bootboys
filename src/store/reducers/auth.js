import * as actionTypes from "../actions/actionTypes";

const initialState = {
    token: null,
    userId: null,
    email: "",
    name: "",
    error: null,
    loginLoading: false,
    loadingPasswordChange: false,
    loadingCreatingAccount: false,
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
                loginLoading: false,
                token: action.idToken,
                userId: action.localId,
                email: action.email,
                name: action.name
            };
        case actionTypes.AUTH_FAIL:
            return {
                ...state,
                loginLoading: false,
                error: action.error
            };
        case actionTypes.AUTH_LOGOUT:
            return {
                ...state,
                token: null,
                userId: null,
                email: "",
                name: "",
                error: null,
                loginLoading: false,
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
            };
        default:
            return state;
    }
};

export default reducer;
