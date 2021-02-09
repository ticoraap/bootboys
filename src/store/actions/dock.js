import * as actionTypes from "../actions/actionTypes";
import { Api } from "../../api";
import * as actions from "./"

export const getAllDocks = () => {
    return (dispatch) => {
        dispatch(getAllDocksStart());
        Api.dock
            .getAllOwned()
            .then((response) => {
                const docksArray = [];
                for (const [key, value] of Object.entries(response.data)) {
                    value.dockid = key;
                    docksArray.push(value);
                }

                dispatch(getAllDocksSuccess(docksArray));
            })
            .catch((error) => {
                dispatch(getAllDocksFail(error));
            });
    };
};

export const getAllDocksStart = () => {
    return {
        type: actionTypes.GET_ALL_DOCKS_START,
    };
};

export const getAllDocksSuccess = (docks) => {
    return {
        type: actionTypes.GET_ALL_DOCKS_SUCCESS,
        docks: docks,
    };
};

export const getAllDocksFail = (error) => {
    return {
        type: actionTypes.GET_ALL_DOCKS_FAIL,
        error: error,
    };
};

export const removeDock = (dockid) => {
    return (dispatch) => {
        dispatch(actions.removeUserDockStart())
        Api.user.removeDock(dockid).then(() => {
            dispatch(actions.removeUserDockSuccess)
            dispatch(removeDockStart());
            Api.dock
                .remove(dockid)
                .then(() => {
                    dispatch(removeDockSuccess(dockid));
                })
                .catch((error) => {
                    dispatch(removeDockFail(error));
                });
        }).catch(()=> {
            dispatch(actions.removeUserDockFail)
        })
    };
};

export const removeDockStart = () => {
    return {
        type: actionTypes.REMOVE_DOCK_START,
    };
};

export const removeDockSuccess = (dockid) => {
    return {
        type: actionTypes.REMOVE_DOCK_SUCCESS,
        dockid: dockid,
    };
};

export const removeDockFail = (error) => {
    return {
        type: actionTypes.REMOVE_DOCK_FAIL,
        error: error,
    };
};

export const addDock = (dock) => {
    return (dispatch) => {
        Api.user
            .addDock(dock)
            .then((response) => {
                dispatch(addDockStart());
                Api.dock
                    .add(response.data.name, dock)
                    .then((response) => {
                        dock = {
                            ...dock,
                            dockid: response.data.dockid,
                        };
                        dispatch(addDockSuccess(dock));
                    })
                    .catch((error) => {
                        dispatch(addDockFail(error));
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    };
};

export const addDockStart = () => {
    return {
        type: actionTypes.ADD_DOCK_START,
    };
};

export const addDockSuccess = (dock) => {
    return {
        type: actionTypes.ADD_DOCK_SUCCESS,
        dock: dock,
    };
};

export const addDockFail = (error) => {
    return {
        type: actionTypes.ADD_DOCK_FAIL,
        error: error,
    };
};

export const getDockById = (dockid) => {
    return {
        type: actionTypes.GET_DOCK_BY_ID,
        dockid: dockid,
    };
};
