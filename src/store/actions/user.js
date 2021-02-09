import * as actionTypes from "../actions/actionTypes";
import { Api } from "../../api";


export const getUserDocks = () => {
    return (dispatch) => {
        dispatch(getUserDockStart());
        Api.user
            .getDocks()
            .then((response) => {
                const userDocksArray = [];
                for (const [key, value] of Object.entries(response.data)) {
                    value.dockid = key;
                    userDocksArray.push(value);
                }
                dispatch(getUserDockSuccess(userDocksArray));
            })
            .catch((error) => {
                dispatch(getUserDockFail(error));
            });
    };
};

export const getUserDockStart = () => {
    return {
        type: actionTypes.GET_USER_DOCKS_START,
    };
};

export const getUserDockSuccess = (userDocks) => {
    return {
        type: actionTypes.GET_USER_DOCKS_SUCCESS,
        userDocks: userDocks
    };
};

export const getUserDockFail = () => {
    return {
        type: actionTypes.GET_USER_DOCKS_FAIL,
    };
};

export const removeUserDockStart = () => {
    return {
        type: actionTypes.REMOVE_USER_DOCK_START,
    };
};

export const removeUserDockSuccess = (dockid) => {
    return {
        type: actionTypes.REMOVE_USER_DOCK_SUCCESS,
        dockid: dockid,
    };
};

export const removeUserDockFail = (error) => {
    return {
        type: actionTypes.REMOVE_USER_DOCK_FAIL,
        error: error,
    };
};