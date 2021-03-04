import React, { Component } from "react";
import classes from "./AddressCreator.module.css";

import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

import Input from "../../components/UI/InputCom/InputCom";
import Select from "../../components/UI/Select/Select";
import Button from "../../components/UI/Button/Button";

import { queryAddressLatLong } from "./LocationQuery";
import PropTypes from "prop-types";
import Spinner from "../../components/UI/Spinner/Spinner";

import { countryCodes } from "./countryCodes";

class AddressCreator extends Component {
    state = {
        street: { value: "", valid: false },
        number: { value: "", valid: false },
        postalcode: { value: "", valid: false },
        city: { value: "", valid: false },
        country: { value: "NL", valid: true },
        allFieldsValid: false,
        loading: false,
        badAddressWarning: false,
    };

    componentDidUpdate(prevProps) {
        if (
            this.props.addressAddedSuccess &&
            prevProps.addressAddedSuccess !== this.props.addressAddedSuccess
        ) {
            this.resetAddressForm();
            this.props.notifyDockCreatorAddressAdded();
            this.props.onAddressCreatorSuccessReceived();
        }
    }

    onInputChange = (id, value, valid) => {
        this.setState({
            [id]: { value: value, valid: valid },
        });
        this.isFormValid();
    };

    isFormValid = () => {
        this.setState((prevState) => {
            return {
                allFieldsValid:
                    prevState.street.valid &&
                    prevState.number.valid &&
                    prevState.postalcode.valid &&
                    prevState.city.valid &&
                    prevState.country.valid,
            };
        });
    };

    onSubmit = (event) => {
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
                    this.showAddressWarning(address);
                });
        }
    };

    getAddressFromInputValues = () => {
        return {
            street: this.state.street.value,
            houseNumber: this.state.number.value,
            postalcode: this.state.postalcode.value.split(" ").join(""),
            city: this.state.city.value,
            country: this.state.country.value,
        };
    };

    showAddressWarning = (address) => {
        this.setState({
            address: address,
            badAddressWarning: true,
            loading: false,
        });
    };

    submitWarnedAboutAddress = () => {
        this.submitNewAddress(this.getAddressFromInputValues());
    };

    submitNewAddress = (address) => {
        this.props.onAddUserAddress(address).then(console.log("bladiebla"));
    };

    finishadd = () => {
        console.log(this.state);
    };

    resetAddressForm = () => {
        this.setState({
            street: { value: "", valid: false },
            number: { value: "", valid: false },
            postalcode: { value: "", valid: false },
            city: { value: "", valid: false },
            country: { value: "", valid: true },
            allFieldsValid: false,
            badAddressWarning: false,
            loading: false,
        });
    };

    render() {
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
                    <form
                        onSubmit={this.onSubmit}
                        className={classes.AddressForm}
                    >
                        <Input
                            id="street"
                            type="text"
                            value={this.state.street.value}
                            label="Street"
                            placeholder="Applestreet"
                            validationRules={{
                                required: true,
                            }}
                            notifyParentOfChange={this.onInputChange}
                        />
                        <Input
                            id="number"
                            type="text"
                            value={this.state.number.value}
                            label="Number"
                            placeholder="12e"
                            validationRules={{
                                required: true,
                            }}
                            notifyParentOfChange={this.onInputChange}
                        />
                        <Input
                            id="postalcode"
                            type="text"
                            value={this.state.postalcode.value}
                            label="Postal code"
                            placeholder="1234AB"
                            validationRules={{
                                required: true,
                                isPostalcode: true,
                            }}
                            notifyParentOfChange={this.onInputChange}
                        />
                        <Input
                            id="city"
                            type="text"
                            value={this.state.city.value}
                            label="City"
                            placeholder="Leiden"
                            validationRules={{
                                required: true,
                            }}
                            notifyParentOfChange={this.onInputChange}
                        />
                        <Select
                            id="country"
                            value={this.state.country.value}
                            label="Country"
                            invalidMessage="Please select a country"
                            options={countryCodes}
                            notifyParentOfChange={this.onInputChange}
                        />
                        {this.renderSubmitButton()}
                    </form>
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

AddressCreator.propTypes = {
    addAddress: PropTypes.func,
    notifyDockCreatorAddressAdded: PropTypes.func,
    onAddUserAddress: PropTypes.func,
    addressAddedSuccess: PropTypes.bool,
    onAddressCreatorSuccessReceived: PropTypes.func,
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
        onAddressCreatorSuccessReceived: () =>
            dispatch(actions.addAddressSuccessReceived()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressCreator);
