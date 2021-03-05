import * as actionTypes from "../actions/actionTypes";
import { Api } from "../../api";
import * as utility from "../../shared/utility";

export const getUserAddresses = () => {
    return (dispatch) => {
        dispatch(getUserAddressesStart());
        Api.address
            .getAllFromUser()
            .then((response) => {
                const addresses = utility.JSONtoObjectArrary(
                    response.data,
                    "addressid"
                );
                dispatch(getUserAddressesSuccess(addresses));
            })
            .catch((error) => {
                dispatch(getUserAddressesFail(error));
            });
    };
};
export const getUserAddressesStart = () => {
    return {
        type: actionTypes.GET_USER_ADDRESSES_START,
    };
};

export const getUserAddressesSuccess = (addresses) => {
    return {
        type: actionTypes.GET_USER_ADDRESSES_SUCCESS,
        userAddresses: addresses,
    };
};

export const getUserAddressesFail = (error) => {
    return {
        type: actionTypes.GET_USER_ADDRESSES_FAIL,
        error: error,
    };
};

export const addUserAddress = (address) => {
    return (dispatch) => {
        dispatch({ type: actionTypes.ADD_USER_ADDRESS_START });
        Api.address
            .add(address)
            .then(() => {
                dispatch({ type: actionTypes.ADD_USER_ADDRESS_SUCCESS });
                dispatch(getUserAddresses())
            })
            .catch(() => {
                dispatch({ type: actionTypes.ADD_USER_ADDRESS_FAIL });
            });
    };
};