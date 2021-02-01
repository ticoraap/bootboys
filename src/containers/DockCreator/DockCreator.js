import React, { Component } from "react";
import classes from "./DockCreator.module.css";
import PropTypes from "prop-types";

import { dockCreatorForm } from "./DockCreatorForm";

import * as utility from "../../shared/utility";

import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

import AddAddress from "../AddAddress/AddAddress";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import Modal from "../../components/UI/Modal/Modal";
import { Map, Marker, TileLayer } from "react-leaflet";
import { queryAddressLatLong } from "../AddAddress/LocationQuery";
import FacilityCreator from "../FacilityCreator/FacilityCreator";
import Spinner from "../../components/UI/Spinner/Spinner";
import ToastMaker from "../../components/shared/ToastMaker";

const MSG_ADDRESS_NOT_FOUND =
    "Could not resolve the address on the map. \nYou need to manually drag te marker to the location of the dock";
const MSG_MARKER_SET =
    "We have pre-selected the location of the dock based on the chosen address, you can drag the marker to the exact location of the dock";
export class DockCreator extends Component {
    state = {
        dockForm: { ...dockCreatorForm },
        allInputFieldsAreValid: false,
        mapcenter: {
            lat: 52.16121472938702,
            lon: 4.501615852518094,
        },
        markerPosition: {
            lat: 52.16121472938702,
            lon: 4.501615852518094,
        },
        addedFacilities: [],
    };

    componentDidMount() {
        this.props.onLoadUserAddresses();
        this.addAddressesToSelectForm();
    }

    componentDidUpdate(prevProps) {
        // reload the addresses in the address selector form
        if (
            prevProps.userAddresses.length !== this.props.userAddresses.length
        ) {
            this.addAddressesToSelectForm();
        }
    }

    addAddressesToSelectForm = () => {
        const selectOptions = this.mapAddressesToSelectOptions();
        this.setAddressSelectFormOptions(selectOptions);
    };

    mapAddressesToSelectOptions = () => {
        return this.props.userAddresses.map((address) => ({
            value: address.addressid,
            displayValue: address.street + " " + address.houseNumber,
        }));
    };

    setAddressSelectFormOptions = (addressSelectOptions) => {
        this.setState({
            dockForm: {
                ...this.state.dockForm,
                address: {
                    ...this.state.dockForm.address,
                    elementConfig: {
                        ...this.state.dockForm.address.elementConfig,
                        options: addressSelectOptions,
                    },
                },
            },
        });
    };

    selectAddressHandler = (event, inputElementKey) => {
        this.inputFieldChangedHandler(event, inputElementKey);
        this.updateFormWithAddressId(event.target.value);
    };

    inputFieldChangedHandler = (event, inputElementKey) => {
        this.updateInputField(event.target.value, inputElementKey);
        this.updateDockFormSubmitValidity();
    };

    updateInputField = (inputElementValue, inputElementKey) => {
        this.setState({
            dockForm: this.getUpdatedDockForm(
                inputElementValue,
                inputElementKey
            ),
        });
    };

    getUpdatedDockForm = (inputElementValue, inputElementKey) => {
        const valid = this.isInputValid(inputElementValue, inputElementKey);
        return {
            ...this.state.dockForm,
            [inputElementKey]: {
                ...this.state.dockForm[inputElementKey],
                value: inputElementValue,
                valid: valid,
                touched: true,
            },
        };
    };

    isInputValid = (inputElementValue, inputElementKey) => {
        const validationRules = this.state.dockForm[inputElementKey]
            .validationRules;
        return utility.isInputValidByRules(inputElementValue, validationRules);
    };

    updateDockFormSubmitValidity = () => {
        this.setState((prevstate) => ({
            allInputFieldsAreValid: this.isTheFormValid(prevstate.dockForm),
        }));
    };

    isTheFormValid = (dockForm) => {
        let allInputFieldsAreValid = true;
        for (let formElement of Object.values(dockForm)) {
            if (formElement.validationRules) {
                allInputFieldsAreValid =
                    allInputFieldsAreValid && formElement.valid;
            }
        }
        return allInputFieldsAreValid;
    };

    dragMarkerHandler = (event) => {
        if (!event.target._latlng) return;

        let latlon = {
            lat: event.target._latlng.lat,
            lon: event.target._latlng.lng,
        };

        latlon = this.keepLatLonInBounds(latlon);

        this.updateDockFormElementsLatLon(latlon);
    };

    keepLatLonInBounds = (latlon) => {
        if (latlon.lon > 180) {
            latlon.lon = 180;
        }
        if (latlon.lon < -180) {
            latlon.lon = -180;
        }
        return latlon;
    };

    updateFormWithAddressId = (addressid) => {
        if (!addressid) return;
        const address = this.getAddressFromId(addressid);
        this.getLatLonFromAddress(address);
    };

    getLatLonFromAddress = (address) => {
        queryAddressLatLong(address)
            .then((latlon) => {
                this.updateDockFormElementsLatLon(latlon);
            })
            .catch(() => {
                this.showToastErrorMessage(MSG_ADDRESS_NOT_FOUND);
            });
    };

    updateDockFormElementsLatLon = (latlon) => {
        this.updateInputField(latlon.lat, "latitude");
        this.updateInputField(latlon.lon, "longitude");
        this.updateMapMarkerPosition(latlon);
    };

    getAddressFromId = (addressid) => {
        return this.props.userAddresses.find(
            (address) => address.addressid === addressid
        );
    };

    updateMapMarkerPosition(latlon) {
        this.setState({
            markerPosition: latlon,
            mapcenter: latlon,
        });
    }

    toggleAddressModal = (event) => {
        if (event) {
            event.preventDefault();
        }
        this.setState({ addingAddress: !this.state.addingAddress });
    };

    toggleManualFillLatLon = (event) => {
        if (event) {
            event.preventDefault();
        }
        const updatedDockForm = {
            ...this.state.dockForm,

            latitude: {
                ...this.state.dockForm.latitude,
                elementConfig: {
                    ...this.state.dockForm.latitude.elementConfig,
                    disabled: !this.state.dockForm.latitude.elementConfig
                        .disabled,
                },
            },
            longitude: {
                ...this.state.dockForm.longitude,
                elementConfig: {
                    ...this.state.dockForm.longitude.elementConfig,
                    disabled: !this.state.dockForm.longitude.elementConfig
                        .disabled,
                },
            },
        };
        this.setState({ dockForm: updatedDockForm });
    };

    notifyAddressAdded = () => {
        this.props.onLoadUserAddresses();
        this.toggleAddressModal();
    };

    setNewFacilityList = (facilityList) => {
        this.setState({ addedFacilities: facilityList });
    };

    showToastErrorMessage = (errorMessage) => {
        ToastMaker.errorToast(errorMessage);
    };

    addDockHandler = (event) => {
        if (event) {
            event.preventDefault();
        }
        const dock = this.getDockFromInputValues();
        this.props.onAddDock(dock);
        this.props.dockManagerToMap();
    };

    getDockFromInputValues = () => {
        return {
            name: this.state.dockForm.name.value,
            addressid: this.state.dockForm.address.value,
            description: this.state.dockForm.description.value,
            length: utility.parseFloatFromMetersInput(
                this.state.dockForm.length.value
            ),
            width: utility.parseFloatFromMetersInput(
                this.state.dockForm.width.value
            ),
            price: utility.parseFloatFromEurosInput(
                this.state.dockForm.price.value
            ),
            place: this.state.dockForm.place.value,
            latitude: parseFloat(this.state.dockForm.latitude.value),
            longitude: parseFloat(this.state.dockForm.longitude.value),
            facilities: this.state.addedFacilities,
        };
    };

    createInputField = (key, children) => {
        return (
            <Input
                key={key}
                {...this.state.dockForm[key]}
                changed={(event) => this.inputFieldChangedHandler(event, key)}
            >
                {children}
            </Input>
        );
    };

    createSelectField = (key, children) => {
        return (
            <Input
                key={key}
                {...this.state.dockForm[key]}
                changed={(event) => this.selectAddressHandler(event, key)}
            >
                {children}
            </Input>
        );
    };

    render() {
        const basicInformationTitle = (
            <h5 key={"basicInformationTitle"}>
                {this.state.dockForm.name.value.length
                    ? this.state.dockForm.name.value
                    : "New Dock"}
            </h5>
        );
        const name = this.createInputField("name");
        const address = this.createSelectField("address");
        const newAddressButton = (
            <div key={"newAddressButton"} style={{ width: "15%" }}>
                <Button btnType="Form" clicked={this.toggleAddressModal}>
                    {"New"}
                </Button>
            </div>
        );
        const description = this.createInputField("description");
        const facilityCreator = this.createInputField(
            "facilityCreator",
            <FacilityCreator
                facilities={this.state.addedFacilities}
                setNewFacilityList={this.setNewFacilityList}
            />
        );
        const length = this.createInputField("length");
        const width = this.createInputField("width");
        const price = this.createInputField("price");
        const place = this.createInputField("place");
        const locationTitle = <h5 key={"locationTitle"}>Location</h5>;
        const locationSubText = <p key={"locationSubText"}>{MSG_MARKER_SET}</p>;
        const latitude = this.createInputField("latitude");
        const longitude = this.createInputField("longitude");
        const manualFillLatLonButton = (
            <div key={"manualFillLatLon"} style={{ width: "20%" }}>
                <Button btnType="Form" clicked={this.toggleManualFillLatLon}>
                    {"Edit"}
                </Button>
            </div>
        );
        const map = (
            <div className={classes.Leaflet}>
                <Map
                    center={this.state.mapcenter}
                    zoom={20}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        noWrap
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                        position={this.state.markerPosition}
                        draggable
                        onDragend={this.dragMarkerHandler}
                    ></Marker>
                </Map>
            </div>
        );
        const submitDockButton = (
            <Button
                clicked={this.addDockHandler}
                disabled={!this.state.allInputFieldsAreValid}
            >
                Submit new Dock
            </Button>
        );
        let processingSpinner = this.props.addDockLoading ? (
            <div className={classes.Feedback}>
                <Spinner />
            </div>
        ) : null;

        return (
            <div>
                {processingSpinner}
                <Modal
                    show={this.state.addingAddress}
                    modalClosed={this.toggleAddressModal}
                >
                    <AddAddress
                        notifyDockCreatorAddressAdded={this.notifyAddressAdded}
                    />
                </Modal>
                <div className={classes.DockCreator}>
                    <div className={classes.DockForm}>
                        <div className={classes.FormInformation}>
                            {basicInformationTitle}
                            {address}
                            {newAddressButton}
                            {name}
                            {description}
                            {facilityCreator}
                            {length}
                            {width}
                            {price}
                            {place}
                        </div>
                        <div className={classes.FormLocation}>
                            {locationTitle}
                            {locationSubText}
                            {latitude}
                            {longitude}
                            {manualFillLatLonButton}
                            {map}
                            {submitDockButton}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

DockCreator.propTypes = {
    onAddDock: PropTypes.func,
    addDockLoading: PropTypes.bool,
    dockManagerToMap: PropTypes.func,
    onLoadUserAddresses: PropTypes.func,
    userAddresses: PropTypes.array,
};

const mapStateToProps = (state) => {
    return {
        userDocks: state.dock.userDocks,
        userDocksLoading: state.dock.userDocksLoading,
        addDockLoading: state.dock.addDockLoading,

        userAddresses: state.address.userAddresses,
        userAddressesLoading: state.address.userAddressesLoading,
        addAddressLoading: state.address.addAddressLoading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAddDock: (dock) => dispatch(actions.addDock(dock)),
        onLoadUserAddresses: () => dispatch(actions.getUserAddresses()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DockCreator);
