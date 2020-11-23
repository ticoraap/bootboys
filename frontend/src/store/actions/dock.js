import * as actionTypes from '../actions/actionTypes';
import ApiService from '../../components/shared/Api.service'



export const getUserDocks = () => {
    return dispatch =>{
        dispatch(getUserDocksStart())
        ApiService.getJson('/userdocks')
            .then(userDocks => {
                dispatch(getUserDocksSuccess(userDocks))
            })
            .catch((error) => {
                dispatch(getUserDocksFail(error))
            })
    }
}
export const getUserDocksStart = () => {
    return {
        type: actionTypes.GET_USER_DOCKS_START
    }
}

export const getUserDocksSuccess = (userDocks) => {
    return {
        type: actionTypes.GET_USER_DOCKS_SUCCESS,
        userDocks: userDocks
    }
}

export const getUserDocksFail = (error) => {
    return {
        type: actionTypes.GET_USER_DOCKS_FAIL,
        error: error
    }
}



export const removeDock = (dockid) => {
    return dispatch => {
        dispatch(removeDockStart())
        ApiService.remove("/dock/" + dockid)
            .then(() => {
                dispatch(removeDockSuccess(dockid))
            })
            .catch((error) => {
                dispatch(removeDockFail(error))
            })
    }
}

export const removeDockStart = () => {
    return {
        type: actionTypes.REMOVE_DOCK_START,
    }
}

export const removeDockSuccess = (dockid) => {
    return {
        type: actionTypes.REMOVE_DOCK_SUCCESS,
        dockid: dockid
    }
}

export const removeDockFail = (error) => {
    return {
        type: actionTypes.REMOVE_DOCK_FAIL,
        error: error
    }
}



export const addDock = (dock) => {
    return dispatch => {
        dispatch(addDockStart())
        ApiService.post('/dock', dock)
            .then(response => response.json())
            .then(data => {
                dock = {
                    ...dock,
                    dockid: data.dockid
                }
                dispatch(addDockSuccess(dock))
            })
            .catch(error => {
                dispatch(addDockFail(error))
            })
    }
}

export const addDockStart = () => {
    return {
        type: actionTypes.ADD_DOCK_START,
    }
}

export const addDockSuccess = (dock) => {
    return {
        type: actionTypes.ADD_DOCK_SUCCESS,
        dock: dock
    }
}

export const addDockFail = (error) => {
    return {
        type: actionTypes.ADD_DOCK_FAIL,
        error: error
    }
}


export const getDockById = (dockid) => {
    return {
        type: actionTypes.GET_DOCK_BY_ID,
        dockid: dockid
    }
}