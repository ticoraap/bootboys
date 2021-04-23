import React, { Component } from "react";
import classes from "./DockEditor.module.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import LocationEditor from "./LocationEditor/LocationEditor";
import FacilityEditor from "./FacilityEditor/FacilityEditor";
import {
    parseFloatFromEurosInput,
    parseFloatFromMetersInput,
} from "../../shared/utility";

class DockEditor extends Component {
    state = {
        title: { value: "", valid: false },
        description: { value: "", valid: false },
        length: { value: "", valid: false },
        width: { value: "", valid: false },
        price: { value: "", valid: false },
        label: { value: "", valid: true },
        locationDetails: {
            value: { latitude: "", longitude: "", addressid: "" },
            valid: false,
        },
        facilities: [],
        isFormValid: false,
    };

    componentDidUpdate(prevProps) {
        if (prevProps.addDockLoading && this.props.addDockLoading === false) {
            this.props.onDockCreated();
        }
    }

    onInputChange = (id, value, valid) => {
        this.setState({
            [id]: { value, valid },
        });
        this.setFormValidityToState();
    };

    setFormValidityToState = () => {
        this.setState((prevState) => {
            return {
                isFormValid:
                    prevState.title.valid &&
                    prevState.description.valid &&
                    prevState.length.valid &&
                    prevState.width.valid &&
                    prevState.price.valid &&
                    prevState.label.valid &&
                    prevState.locationDetails.valid,
            };
        });
    };

    setLocationDetails = (addressid, latitude, longitude, valid) => {
        this.onInputChange(
            "locationDetails",
            { addressid: addressid, latitude: latitude, longitude: longitude },
            valid
        );
    };

    setFacilities = (facilities) => {
        this.setState({
            facilities: facilities,
        });
    };

    onAddDockHandler = () => {
        this.props.onAddDock(this.getDockFromInputValues());
    };

    getDockFromInputValues = () => {
        return {
            name: this.state.title.value,
            addressid: this.state.locationDetails.value.addressid,
            description: this.state.description.value,
            length: parseFloatFromMetersInput(this.state.length.value),
            width: parseFloatFromMetersInput(this.state.width.value),
            price: parseFloatFromEurosInput(this.state.price.value),
            place: this.state.label.value,
            latitude: parseFloat(this.state.locationDetails.value.latitude),
            longitude: parseFloat(this.state.locationDetails.value.longitude),
            facilities: this.state.facilities,
        };
    };

    render() {
        return (
            <div className={classes.DockEditor}>
                <div className={classes.DockProperties}>
                    <h5>Dock Properties</h5>
                    <Input
                        className={classes.Input}
                        id="title"
                        type="text"
                        value={this.state.title.value}
                        label="Title/name of the dock"
                        placeholder="Enter a name"
                        validationRules={{
                            required: true,
                        }}
                        notifyParentOfChange={this.onInputChange}
                    />
                    <Input
                        className={classes.Input}
                        id="description"
                        type="textArea"
                        value={this.state.description.value}
                        label="Description of the dock"
                        placeholder="Sunny view ect."
                        validationRules={{
                            required: true,
                        }}
                        notifyParentOfChange={this.onInputChange}
                    />
                    <Input
                        className={classes.InputHalf}
                        id="length"
                        type="text"
                        value={this.state.length.value}
                        label="Length of the dock"
                        placeholder="ex 7,5"
                        validationRules={{
                            required: true,
                            isMeters: true,
                        }}
                        notifyParentOfChange={this.onInputChange}
                    />
                    <Input
                        className={classes.InputHalf}
                        id="width"
                        type="text"
                        value={this.state.width.value}
                        label="Width of the dock"
                        placeholder="ex 3,5"
                        validationRules={{
                            required: true,
                            isMeters: true,
                        }}
                        notifyParentOfChange={this.onInputChange}
                    />
                    <Input
                        className={classes.InputHalf}
                        id="price"
                        type="text"
                        value={this.state.price.value}
                        label="Price per day"
                        placeholder="20"
                        validationRules={{
                            required: true,
                            isEuros: true,
                        }}
                        notifyParentOfChange={this.onInputChange}
                    />
                    <Input
                        className={classes.InputHalf}
                        id="label"
                        type="text"
                        value={this.state.label.value}
                        label="Recognizable property"
                        placeholder="By the green pole ect."
                        notifyParentOfChange={this.onInputChange}
                    />
                </div>
                <FacilityEditor
                    facilities={this.state.facilities}
                    setFacilities={this.setFacilities}
                />
                <LocationEditor setLocationDetails={this.setLocationDetails} />
                <Button
                    disabled={!this.state.isFormValid}
                    clicked={this.onAddDockHandler}
                >
                    Submit new Dock
                </Button>
            </div>
        );
    }
}

DockEditor.propTypes = {
    onAddDock: PropTypes.func,
    addDockLoading: PropTypes.bool,
    onLoadUserAddresses: PropTypes.func,
    userAddresses: PropTypes.array,
    onDockCreated: PropTypes.func,
};

const mapStateToProps = (state) => {
    return {
        addDockLoading: state.dock.addDockLoading,
        userAddresses: state.address.userAddresses,
        userAddressesLoading: state.address.userAddressesLoading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAddDock: (dock) => dispatch(actions.addDock(dock)),
        onLoadUserAddresses: () => dispatch(actions.getUserAddresses()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DockEditor);
