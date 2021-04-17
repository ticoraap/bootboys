import React, { Component } from "react";
import classes from "./FacilityEditor.module.css";
import PropTypes from "prop-types";

import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import Facility from "./Facility/Facility";

class FacilityEditor extends Component {
    state = {
        description: { value: "", valid: false },
        price: { value: "", valid: false },
        isFormValid: false,
        facilityList: [],
    };

    onInputChange = (id, value, valid) => {
        this.setState({
            [id]: { value, valid },
        });
        this.isFormValid();
    };

    isFormValid = () => {
        this.setState((prevState) => {
            return {
                isFormValid:
                    prevState.description.valid && prevState.price.valid,
            };
        });
    };

    resetFacilityForm = () => {
        this.setState({
            description: { value: "", valid: false },
            price: { value: "", valid: false },
            isFormValid: false,
        });
    };

    deleteFacility = (id) => {
        this.props.setFacilities(
            this.getFacilityList().filter((facility) => facility.id !== id)
        );
    };

    addFacility = () => {
        const newFacility = this.getFacilityFromInputValues();
        const newFacilityList = [...this.getFacilityList(), newFacility];
        this.props.setFacilities(newFacilityList);
        this.resetFacilityForm();
    };

    getFacilityFromInputValues = () => {
        return {
            id: Date.now(),
            price: parseFloat(
                this.state.price.value.replace(",", ".").replace("€", "")
            ),
            description: this.state.description.value,
        };
    };

    getFacilityList = () => {
        return this.props.facilities;
    };

    getFacilityElements = () => {
        return this.getFacilityList().map((facility) => {
            return (
                <Facility
                    deleteFacility={() => this.deleteFacility(facility.id)}
                    key={facility.id}
                    price={facility.price}
                    description={facility.description}
                />
            );
        });
    };

    render() {
        return (
            <div className={classes.FacilityEditor}>
                <h5>Facilities</h5>
                <Input
                    className={classes.Input}
                    id="description"
                    type="textArea"
                    value={this.state.description.value}
                    label="Description of the Facility"
                    placeholder="Enter a description"
                    validationRules={{
                        required: true,
                    }}
                    notifyParentOfChange={this.onInputChange}
                />
                <Input
                    className={classes.Input70}
                    id="price"
                    type="text"
                    value={this.state.price.value}
                    label="Price of the facility per day"
                    placeholder="Price"
                    validationRules={{
                        required: true,
                        isEuros: true,
                    }}
                    notifyParentOfChange={this.onInputChange}
                />
                <Button
                    clicked={this.addFacility}
                    disabled={!this.state.isFormValid}
                    btnType="Form"
                >
                    Add
                </Button>
                <div className={classes.FacilityList}>
                    {this.getFacilityElements()}
                </div>
            </div>
        );
    }
}

FacilityEditor.propTypes = {
    facilities: PropTypes.array,
    setNewFacilityList: PropTypes.func,
};

export default FacilityEditor;
