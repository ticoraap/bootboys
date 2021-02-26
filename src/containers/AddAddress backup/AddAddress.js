import React, { Component } from "react";
import { addressForm } from "./AddAddressForm";

import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

import * as utility from "../../shared/utility";

import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./AddAddress.module.css";

import { queryAddressLatLong } from "./LocationQuery";
import PropTypes from "prop-types";
import Spinner from "../../components/UI/Spinner/Spinner";

class AddAddress extends Component {
    state = {
        addressForm: { ...addressForm },
        allFieldsValid: false,
        loading: false,
        address: null,
        badAddressWarning: false,
    };

    componentDidUpdate() {
        if (this.props.addressAddedSuccess) {
            this.resetAddressForm();
            this.props.notifyDockCreatorAddressAdded();
            this.props.onAddAddressSuccessReceived()
        }
    }

    inputFieldChangedHandler = (event, inputElementKey) => {
        this.updateAddressFormElement(event.target.value, inputElementKey);
        this.updateAddressFormValidity();
    };

    updateAddressFormElement = (inputElementValue, inputElementKey) => {
        const updatedAddressForm = this.getUpdatedAddressForm(
            inputElementValue,
            inputElementKey
        );
        this.setState({ addressForm: updatedAddressForm });
    };

    getUpdatedAddressForm = (inputElementValue, inputElementKey) => {
        const valid = this.isInputValid(inputElementValue, inputElementKey);
        return {
            ...this.state.addressForm,
            [inputElementKey]: {
                ...this.state.addressForm[inputElementKey],
                value: inputElementValue,
                valid: valid,
                touched: true,
            },
        };
    };

    isInputValid = (inputElementValue, inputElementKey) => {
        const validationRules = this.state.addressForm[inputElementKey]
            .validationRules;
        return utility.isInputValidByRules(inputElementValue, validationRules);
    };

    updateAddressFormValidity = () => {
        this.setState((prevstate) => {
            const allFieldsValid = this.isFormValid(prevstate.addressForm);
            return { allFieldsValid: allFieldsValid, badAddressWarning: false };
        });
    };

    isFormValid = (addressForm) => {
        let allFieldsValid = true;
        for (let formElement of Object.values(addressForm)) {
            if (formElement.validationRules) {
                allFieldsValid = allFieldsValid && formElement.valid;
            }
        }
        return allFieldsValid;
    };

    submitForm = (event) => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.state.badAddressWarning) {
            this.submitWarnedAboutAddress();
        } else {
            const address = this.getAddressFromInputValues();

            queryAddressLatLong(address)
                .then(() => {
                    this.submitNewAddress(address);
                })
                .catch(() => {
                    this.warnAboutAddress(address);
                });
        }
    };

    getAddressFromInputValues = () => {
        return {
            street: this.state.addressForm.street.value,
            houseNumber: this.state.addressForm.houseNumber.value,
            postalcode: this.state.addressForm.postalcode.value
                .split(" ")
                .join(""),
            city: this.state.addressForm.city.value,
            country: this.state.addressForm.country.value,
            state: this.state.addressForm.state.value,
        };
    };

    warnAboutAddress = (address) => {
        this.setState({
            address: address,
            badAddressWarning: true,
            loading: false,
        });
    };

    submitWarnedAboutAddress = () => {
        this.submitNewAddress(this.state.address);
    };

    submitNewAddress = (address) => {
        this.props.onAddUserAddress(address);
    };

    resetAddressForm = () => {
        const UpdatedaddressForm = {
            ...this.state.addressForm,
            street: {
                ...this.state.addressForm.street,
                value: "",
            },
            houseNumber: {
                ...this.state.addressForm.houseNumber,
                value: "",
            },
            postalcode: {
                ...this.state.addressForm.postalcode,
                value: "",
            },
            city: {
                ...this.state.addressForm.city,
                value: "",
            },
            country: {
                ...this.state.addressForm.country,
                value: "NL",
            },
            state: {
                ...this.state.addressForm.state,
                value: "",
            },
        };
        this.setState({
            addressForm: UpdatedaddressForm,
            badAddressWarning: false,
            loading: false,
        });
    };

    render() {
        let form = (
            <form onSubmit={this.submitForm} className={classes.AddressForm}>
                {this.renderFormElements()}
                {this.renderSubmitButton()}
            </form>
        );

        let loadingSpinner = this.state.loading && (
            <div className={classes.Spinner}>
                <Spinner />
            </div>
        );

        return (
            <div>
                <div className={classes.AddressCreator}>
                    {loadingSpinner}
                    <h5>Add a new Address</h5>
                    {form}
                    {this.state.badAddressWarning && (
                        <p className={classes.Warning}>
                            The address entered above could not be resolved do
                            you want to continue anyway?
                        </p>
                    )}
                </div>
            </div>
        );
    }

    renderFormElements = () => {
        const formElementsArray = [];
        for (let key in this.state.addressForm) {
            if (
                key === "state" &&
                this.state.addressForm.country.value !== "US"
            ) {
                continue;
            }
            formElementsArray.push(this.createInputField(key));
        }

        return formElementsArray;
    };

    createInputField = (key) => {
        return (
            <Input
                key={key}
                {...this.state.addressForm[key]}
                changed={(event) => this.inputFieldChangedHandler(event, key)}
            ></Input>
        );
    };

    renderSubmitButton = () => {
        return (
            <div style={{ width: "100%" }}>
                <Button disabled={!this.state.allFieldsValid}>
                    {this.state.badAddressWarning
                        ? "Yes continue"
                        : "Add address"}
                </Button>
            </div>
        );
    };
}

AddAddress.propTypes = {
    addAddress: PropTypes.func,
    notifyDockCreatorAddressAdded: PropTypes.func,
    onAddUserAddress: PropTypes.func,
    addressAddedSuccess: PropTypes.bool,
    onAddAddressSuccessReceived: PropTypes.func
};

const mapStateToProps = (state) => {
    return {
        addressAddedSuccess: state.address.addressAddedSuccess,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAddUserAddress: (address) =>
            dispatch(actions.addUserAddress(address)),
        onAddAddressSuccessReceived: () =>
            dispatch(actions.addAddressSuccessReceived()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAddress);
