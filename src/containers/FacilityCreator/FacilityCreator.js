import React, { Component } from "react";

import Facility from "./Facility/Facility";
import classes from "./FacilityCreator.module.css";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import PropTypes from "prop-types";
import { facilityCreatorForm } from "./FacilityCreatorForm";
import * as utility from "../../shared/utility";

class FacilityCreator extends Component {
    state = {
        facilityForm: { ...facilityCreatorForm },
        allInputFieldsAreValid: false,
    };

    inputFieldChangedHandler = (event, formElementId) => {
        this.updateInputField(event.target.value, formElementId);
        this.updateFacilityFormSubmitValidity();
    };

    updateInputField = (inputElementValue, inputElementKey) => {
        this.setState({
            facilityForm: this.getUpdatedFacilityForm(
                inputElementValue,
                inputElementKey
            ),
        });
    };

    getUpdatedFacilityForm = (inputElementValue, inputElementKey) => {
        return {
            ...this.state.facilityForm,
            [inputElementKey]: {
                ...this.state.facilityForm[inputElementKey],
                value: inputElementValue,
                valid: this.isInputValid(inputElementValue, inputElementKey),
                touched: true,
            },
        };
    };

    isInputValid = (inputElementValue, inputElementKey) => {
        const validationRules = this.state.facilityForm[inputElementKey]
            .validationRules;
        return utility.isInputValidByRules(inputElementValue, validationRules);
    };

    updateFacilityFormSubmitValidity = () => {
        this.setState((prevState) => ({
            allInputFieldsAreValid: this.isTheFormValid(prevState.facilityForm),
        }));
    };

    isTheFormValid = (facilityForm) => {
        let allInputFieldsAreValid = true;
        for (let formElement of Object.values(facilityForm)) {
            if (formElement.validationRules) {
                allInputFieldsAreValid =
                    allInputFieldsAreValid && formElement.valid;
            }
        }
        return allInputFieldsAreValid;
    };

    deleteFacility = (id) => {
        this.props.setNewFacilityList(
            this.props.facilities.filter((facility) => facility.id !== id)
        );
    };

    addFacilityHandler = () => {
        const newFacility = this.getFacilityFromInputValues();
        const newFacilityList = [...this.props.facilities, newFacility];
        this.props.setNewFacilityList(newFacilityList);
        this.resetFacilityForm();
    };

    getFacilityFromInputValues = () => {
        return {
            id: Date.now(),
            price: parseFloat(
                this.state.facilityForm.price.value
                    .replace(",", ".")
                    .replace("€", "")
            ),
            description: this.state.facilityForm.description.value,
        };
    };

    resetFacilityForm = () => {
        this.setState({
            facilityForm: { ...facilityCreatorForm },
            allInputFieldsAreValid: false,
        });
    };

    render() {
        const formElementsArray = [];
        for (let key in this.state.facilityForm) {
            formElementsArray.push({
                id: key,
                config: this.state.facilityForm[key],
            });
        }

        let form = (
            <div className={classes.FacilityForm}>
                {formElementsArray.map((formElement) => {
                    if (
                        formElement.config.elementType === "saveFacilityButton"
                    ) {
                        return (
                            <Button
                                key={formElement.id}
                                clicked={this.addFacilityHandler}
                                btnType="Form"
                                disabled={!this.state.allInputFieldsAreValid}
                            >
                                Save
                            </Button>
                        );
                    }

                    return (
                        <Input
                            {...formElement.config}
                            key={formElement.id}
                            changed={(event) =>
                                this.inputFieldChangedHandler(
                                    event,
                                    formElement.id
                                )
                            }
                        />
                    );
                })}
            </div>
        );

        const facilities = this.props.facilities.map((facility) => {
            return (
                <Facility
                    deleteFacility={() => this.deleteFacility(facility.id)}
                    key={facility.id}
                    price={facility.price}
                    description={facility.description}
                />
            );
        });

        return (
            <div className={classes.FacilityCreator}>
                {facilities}
                {form}
            </div>
        );
    }
}

FacilityCreator.propTypes = {
    facilities: PropTypes.array,
    setNewFacilityList: PropTypes.func,
};

export default FacilityCreator;
