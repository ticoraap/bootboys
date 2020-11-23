import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';


const initialState = {
    allDocks: [],
    allDocksLoading: false,
    userDocks: [],
    userDocksLoading: false,
    removeLoading: false,
    addDockLoading: false
}

const getUserDocksStart = (state) => {
    return updateObject(state, {
        userDocksLoading: true
    })
}
const getUserDocksSuccess = (state, action) => {
    return updateObject(state, {
        userDocksLoading: false,
        userDocks: action.userDocks
    })
    
}
const getUserDocksFail = (state) => {
    return updateObject(state, {
        userDocksLoading: false
    })
}


const removeDockStart = (state) => {
    return updateObject(state, {
        removeLoading: true
    })
}
const removeDockSuccess = (state, action) => {
    const filteredDocks = state.userDocks.filter(dock => dock.dockid !== action.dockid)
    return updateObject(state, {
        removeLoading: false,
        userDocks: filteredDocks
    })
}
const removeDockFail = (state) => {
    return updateObject(state, {
        removeLoading: true,
    })
}



const addDockStart = (state) => {
    return updateObject(state, {
        addDockLoading: true
    })
}
const addDockSuccess = (state, action) => {
    const updatedDocks = [...state.userDocks, action.dock]
    return updateObject(state, {
        addDockLoading: false,
        userDocks: updatedDocks
    })
}
const addDockFail = (state) => {
    return updateObject(state, {
        addDockLoading: false,
    })
}


const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.GET_USER_DOCKS_START: return getUserDocksStart(state, action)
        case actionTypes.GET_USER_DOCKS_SUCCESS: return getUserDocksSuccess(state, action)
        case actionTypes.GET_USER_DOCKS_FAIL: return getUserDocksFail(state, action)
        case actionTypes.REMOVE_DOCK_START: return removeDockStart(state, action)
        case actionTypes.REMOVE_DOCK_SUCCESS: return removeDockSuccess(state, action)
        case actionTypes.REMOVE_DOCK_FAIL: return removeDockFail(state, action)
        case actionTypes.ADD_DOCK_START: return addDockStart(state, action)
        case actionTypes.ADD_DOCK_SUCCESS: return addDockSuccess(state, action)
        case actionTypes.ADD_DOCK_FAIL: return addDockFail(state, action)
        default: return state
    }
}


export default reducer;