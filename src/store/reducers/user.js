import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
    userDocks: [],
    userDocksLoading: false,
};

const addUserDockSuccess = (state, action) => {
    return updateObject(state, {
        userDocks: [...state.userDocks, action.userDock],
    });
};

const removeUserDockSuccess = (state, action) => {
    const filteredDocks = state.userDocks.filter(
        (dock) => dock.dockid !== action.dockid
    );
    return updateObject(state, {
        userDocks: filteredDocks,
    });
};

const getUserDocksStart = (state) => {
    return updateObject(state, {
        userDocksLoading: true,
    });
};

const getUserDocksSuccess = (state, action) => {
    return updateObject(state, {
        userDocksLoading: false,
        userDocks: action.userDocks,
    });
};

const getUserDocksFail = (state) => {
    return updateObject(state, {
        userDocksLoading: false,
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_USER_DOCKS_START:
            return getUserDocksStart(state, action);
        case actionTypes.GET_USER_DOCKS_SUCCESS:
            return getUserDocksSuccess(state, action);
        case actionTypes.GET_USER_DOCKS_FAIL:
            return getUserDocksFail(state, action);
        case actionTypes.ADD_USER_DOCK_SUCCESS:
            return addUserDockSuccess(state, action);
        case actionTypes.REMOVE_USER_DOCK_SUCCESS:
            return removeUserDockSuccess(state, action);
        default:
            return state;
    }
};

export default reducer;
