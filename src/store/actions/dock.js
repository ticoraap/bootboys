import * as actionTypes from "../actions/actionTypes";
import { Api } from "../../api";
import * as actions from "./";

export const getAllDocks = () => {
    return (dispatch) => {
        dispatch(getAllDocksStart());
        Api.dock
            .getAllOwned()
            .then((response) => {
                if (response.data != null) {
                    const docksArray = [];
                    for (const [key, value] of Object.entries(response.data)) {
                        value.dockid = key;
                        docksArray.push(value);
                    }

                    dispatch(getAllDocksSuccess(docksArray));
                } else {
                    throw new Error();
                }
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
        dispatch(actions.removeUserDockStart());
        Api.user
            .removeDock(dockid)
            .then(() => {
                dispatch(removeDockStart());
                Api.dock
                    .remove(dockid)
                    .then(() => {
                        dispatch(actions.removeUserDockSuccess(dockid));
                        dispatch(removeDockSuccess(dockid));
                    })
                    .catch((error) => {
                        dispatch(removeDockFail(error));
                    });
            })
            .catch(() => {
                dispatch(actions.removeUserDockFail);
            });
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
        dispatch(actions.addUserDockStart());
        Api.user
            .addDock(dock)
            .then((response) => {
                dispatch(addDockStart());
                Api.dock
                    .add(response.data.name, dock)
                    .then((secondResponse) => {
                        dock = {
                            ...dock,
                            dockid: response.data.name,
                        };
                        dispatch(actions.addUserDockSuccess(dock));
                        dispatch(addDockSuccess(dock));
                    })
                    .catch((error) => {
                        dispatch(addDockFail(error));
                    });
            })
            .catch((error) => {
                dispatch(actions.addUserDockFail(error));
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

export const getDockWithAddressById = (dockid) => {
    return (dispatch) => {
        dispatch(getDockWithAddressByIdStart());
        Api.dock
            .get(dockid)
            .then((dockResponse) => {
                Api.address
                    .get(dockResponse.data.addressid)
                    .then((addressResponse) => {
                        const dockWithAddress = dockResponse.data;
                        dockWithAddress.address = addressResponse.data;
                        dockWithAddress.dockid = dockid;
                        dispatch(
                            getDockWithAddressByIdSuccess(dockWithAddress)
                        );
                    })
                    .catch((error) => {
                        dispatch(getDockWithAddressByIdFail(error));
                    });
            })
            .catch((error) => {
                dispatch(getDockWithAddressByIdFail(error));
            });
    };
};
export const getDockWithAddressByIdStart = () => {
    return {
        type: actionTypes.GET_DOCK_WITH_ADDRESS_BY_ID_START,
    };
};
export const getDockWithAddressByIdSuccess = (dockWithAddress) => {
    return {
        type: actionTypes.GET_DOCK_WITH_ADDRESS_BY_ID_SUCCESS,
        dockWithAddress: dockWithAddress,
    };
};
export const getDockWithAddressByIdFail = (error) => {
    return {
        type: actionTypes.GET_DOCK_WITH_ADDRESS_BY_ID_FAIL,
        error: error,
    };
};
