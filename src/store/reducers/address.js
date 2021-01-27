import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
    userAddresses: [],
    userAddressesLoading: false,
    addAddressLoading: false,
};

const getUserAddressesStart = (state) => {
    return updateObject(state, {
        userAddressesLoading: true,
    });
};

const getUserAddressesSuccess = (state, action) => {
    return updateObject(state, {
        userAddressesLoading: false,
        userAddresses: action.userAddresses,
    });
};

const getUserAddressesFail = (state) => {
    return updateObject(state, {
        userAddressesLoading: false,
    });
};

const addAddressStart = (state) => {
    return updateObject(state, {
        addAddressLoading: true,
    });
};

const addAddressSuccess = (state) => {
    return updateObject(state, {
        addAddressLoading: false,
    });
};

const addAddressFail = (state) => {
    return updateObject(state, {
        addAddressLoading: false,
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_USER_ADDRESSES_START:
            return getUserAddressesStart(state, action);
        case actionTypes.GET_USER_ADDRESSES_SUCCESS:
            return getUserAddressesSuccess(state, action);
        case actionTypes.GET_USER_ADDRESSES_FAIL:
            return getUserAddressesFail(state, action);
        
        case actionTypes.ADD_USER_ADDRESS_START:
            return addAddressStart(state, action);
        case actionTypes.ADD_USER_ADDRESS_SUCCESS:
            return addAddressSuccess(state, action);
        case actionTypes.ADD_USER_ADDRESS_FAIL:
            return addAddressFail(state, action);
        default:
            return state;
    }
};

export default reducer;
