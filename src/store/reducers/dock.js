import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
    allDocks: [],
    dockWithAddress: null,
    allDocksLoading: false,
    removeLoading: false,
    addDockLoading: false,
    getDockWithAddressLoading: false,
};

const getAllDocksStart = (state) => {
    return updateObject(state, {
        allDocksLoading: true,
    });
};

const getAllDocksSuccess = (state, action) => {
    return updateObject(state, {
        allDocksLoading: false,
        allDocks: action.docks,
    });
};

const getAllDocksFail = (state) => {
    return updateObject(state, {
        allDocksLoading: false,
    });
};

const removeDockStart = (state) => {
    return updateObject(state, {
        removeLoading: true,
    });
};

const removeDockSuccess = (state, action) => {
    const filteredDocks = state.allDocks.filter(
        (dock) => dock.dockid !== action.dockid
    );
    return updateObject(state, {
        removeLoading: false,
        allDocks: filteredDocks,
    });
};

const removeDockFail = (state) => {
    return updateObject(state, {
        removeLoading: true,
    });
};

const addDockStart = (state) => {
    return updateObject(state, {
        addDockLoading: true,
    });
};
const addDockSuccess = (state) => {
    return updateObject(state, {
        addDockLoading: false,
    });
};

const addDockFail = (state) => {
    return updateObject(state, {
        addDockLoading: false,
    });
};

const getDockWithAddressByIdStart = (state) => {
    return updateObject(state, {
        getDockWithAddressLoading: true,
    });
};
const getDockWithAddressByIdSuccess = (state, action) => {
    return updateObject(state, {
        getDockWithAddressLoading: false,
        dockWithAddress: action.dockWithAddress
    });
};

const getDockWithAddressByIdFail = (state, action) => {
    return updateObject(state, {
        getDockWithAddressLoading: false,
        error: action.error
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_DOCKS_START:
            return getAllDocksStart(state, action);
        case actionTypes.GET_ALL_DOCKS_SUCCESS:
            return getAllDocksSuccess(state, action);
        case actionTypes.GET_ALL_DOCKS_FAIL:
            return getAllDocksFail(state, action);
        case actionTypes.REMOVE_DOCK_START:
            return removeDockStart(state, action);
        case actionTypes.REMOVE_DOCK_SUCCESS:
            return removeDockSuccess(state, action);
        case actionTypes.REMOVE_DOCK_FAIL:
            return removeDockFail(state, action);
        case actionTypes.ADD_DOCK_START:
            return addDockStart(state, action);
        case actionTypes.ADD_DOCK_SUCCESS:
            return addDockSuccess(state, action);
        case actionTypes.ADD_DOCK_FAIL:
            return addDockFail(state, action);
        case actionTypes.GET_DOCK_WITH_ADDRESS_BY_ID_START:
            return getDockWithAddressByIdStart(state, action);
        case actionTypes.GET_DOCK_WITH_ADDRESS_BY_ID_SUCCESS:
            return getDockWithAddressByIdSuccess(state, action);
        case actionTypes.GET_DOCK_WITH_ADDRESS_BY_ID_FAIL:
            return getDockWithAddressByIdFail(state, action);
        default:
            return state;
    }
};

export default reducer;
