import * as actionTypes from '../actions/actionTypes';
import {authenticationService} from "../../components/LoginComponent/authentication.service";


const initialState = {
    token: null,
    isAuthenticated: authenticationService.checkIfLoggedIn(),
}

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.LOGIN_USER:
            return {
                ...state,
                isAuthenticated: true
            };
        case actionTypes.LOGOUT_USER:
            
            return {
                ...state,
                isAuthenticated: false
            };
        default:
            return state
    }
}


export default reducer;