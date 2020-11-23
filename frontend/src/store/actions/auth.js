import * as actionTypes from '../actions/actionTypes';
import ToastMaker from "../../components/shared/ToastMaker";
import * as actions from './index'

export const loginUser = () => {
    return dispatch => {
        dispatch({type: actionTypes.LOGIN_USER})
        dispatch(actions.getUserDocks())
    }
}

export const logoutUser = (history) => {
    ToastMaker.infoToast('Successfully logged out')
    history.push('/')
    return {
        type: actionTypes.LOGOUT_USER
    }
}