import React, { Component } from "react";
import classes from "./DockCreator.module.css";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

import AddAddress from "../AddAddress/AddAddress";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import Modal from "../../components/UI/Modal/Modal";
import { Map, Marker, TileLayer } from "react-leaflet";
import { queryAddressLatLong } from "../AddAddress/LocationQuery";
import { ApiService } from "../../components/shared/Api.service";
import FacilityCreator from "../FacilityCreator/FacilityCreator";
import Spinner from "../../components/UI/Spinner/Spinner";
import ToastMaker from "../../components/shared/ToastMaker";
export class DockCreator extends Component {
    state = {
        dockForm: {
            name: {
                wrapperClassName: "WrapperclassFull",
                label: "Title/Name of the Dock",
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Title/Name of the Dock",
                },
                value: "",
                validationWarning:
                    "Please enter a Title/Name not greater then 80 chars",
                validationRules: {
                    required: true,
                    maxLength: 80,
                },
                valid: false,
                touched: false,
            },
            address: {
                wrapperClassName: "Wrapperclass35",
                label: "Address",
                elementType: "select",
                elementConfig: {
                    options: [],
                    placeholder: "Select a address",
                    emptyPlaceholder: "Please add a new address",
                },
                value: "",
                validationWarning: "Please choose a address or create a new",
                validationRules: {
                    required: true,
                },
                valid: false,
                touched: false,
            },
            description: {
                wrapperClassName: "WrapperclassFull",
                label: "Description of the Dock",
                elementType: "textArea",
                elementConfig: {
                    type: "text",
                    placeholder:
                        "A safe dock 300m from the nearest trainstation...",
                },
                value: "",
                validationWarning:
                    "Please enter a short description max 500 characters",
                validationRules: {
                    required: true,
                    maxLength: 500,
                },
                valid: false,
                touched: false,
            },
            facilityCreator: {
                wrapperClassName: "WrapperclassFull",
                label: "Add/Remove Facility's",
                elementType: "passChildElement",
            },
            length: {
                wrapperClassName: "WrapperclassFull",
                label: "Length of the dock",
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Length in meters",
                },
                value: "",
                validationWarning: "This field is required",
                validationRules: {
                    required: true,
                    isMeters: true,
                },
                valid: false,
                touched: false,
            },
            width: {
                wrapperClassName: "WrapperclassFull",
                label: "Width of the dock",
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Width in meters",
                },
                value: "",
                validationRules: {
                    required: true,
                    isMeters: true,
                },
                valid: false,
                touched: false,
            },
            price: {
                wrapperClassName: "WrapperclassFull",
                label: "Price in euros per night",
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Example: 25 or €29,99",
                },
                value: "",
                validationWarning: "Price in euros Example: 25 or €29,99",
                validationRules: {
                    required: true,
                    isEuros: true,
                },
                valid: false,
                touched: false,
            },
            place: {
                wrapperClassName: "WrapperclassFull",
                label: "Label for place",
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Example: A or C12",
                },
                value: "",
                validationRules: {
                    required: false,
                },
                valid: false,
                touched: false,
            },
            latitude: {
                wrapperClassName: "Wrapperclass35",
                label: "Latitude",
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Latitude",
                    disabled: true,
                },
                value: "",
                validationRules: {
                    required: true,
                    isLatitude: true,
                },
                valid: false,
                touched: false,
            },
            longitude: {
                wrapperClassName: "Wrapperclass35",
                label: "Longitude",
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Longitude",
                    disabled: true,
                },
                value: "",
                validationRules: {
                    required: true,
                    isLongitude: true,
                },
                valid: false,
                touched: false,
            },
        },
        allFieldsValid: false,
        mapcenter: {
            lat: 52.16121472938702,
            lon: 4.501615852518094,
        },
        markerPosition: {
            lat: 52.16121472938702,
            lon: 4.501615852518094,
        },
        addresses: null,
        facilities: [],
    };

    componentDidMount() {
        this.loadAddresses();
    }

    loadAddresses = () => {
        ApiService.getJson("/address")
            .then((data) => {
                console.log(data);

                if (data) {
                    const addressArray = [];
                    for (const [key, value] of Object.entries(data)) {
                        console.log(key,value)
                        value.addressid = key;
                        addressArray.push(value)
                    }
                    const newAddressess = addressArray.map((resultAddress) => {
                        return {
                            addressid: resultAddress.addressid,
                            street: resultAddress.street,
                            houseNumber: resultAddress.houseNumber,
                            postalcode: resultAddress.postalcode,
                            city: resultAddress.city,
                            country: resultAddress.country,
                            state: resultAddress.state,
                        };
                    });

                    console.log(newAddressess)
                    const newAddressOptions = newAddressess.map((address) => {
                        return {
                            value: address.addressid,
                            displayValue:
                                address.street + " " + address.houseNumber,
                        };
                    });

                    const updatedDockForm = {
                        ...this.state.dockForm,
                        address: {
                            ...this.state.dockForm.address,
                            elementConfig: {
                                ...this.state.dockForm.address
                                    .elementConfig,
                                options: newAddressOptions,
                            },
                        },
                    };

                    this.setState({
                        addresses: newAddressess,
                        dockForm: updatedDockForm,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    checkValidity = (input, rules) => {
        let isValid = true;
        let trimmedInput = String(input).trim();
        let trimmedInputLength = trimmedInput.length;

        if (rules) {
            if (rules.required) {
                isValid = trimmedInput !== "";
            }
            if (rules.minLength) {
                isValid = trimmedInputLength >= rules.minLength && isValid;
            }
            if (rules.maxLength) {
                isValid = trimmedInputLength <= rules.maxLength && isValid;
            }
            if (rules.isEmail) {
                const emailRegExp = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                isValid =
                    emailRegExp.test(String(trimmedInput).toLowerCase()) && isValid;
            }
            if (rules.isPostalcode) {
                const postalCodeRegEx = /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i;
                isValid =
                    postalCodeRegEx.test(String(trimmedInput).toLowerCase()) && isValid;
            }
            if (rules.isMeters) {
                const metersRegExp = /^(\d+(?:[.,]\d{1,2})?['m']?)$/;
                isValid =
                    metersRegExp.test(String(trimmedInput).toLowerCase()) && isValid;
            }
            if (rules.isEuros) {
                const euroCurrencyRegExp = /^(\u20AC)?[0-9]+(,[0-9]{1,2})?$/;
                isValid =
                    euroCurrencyRegExp.test(String(trimmedInput).toLowerCase()) && isValid;
            }
            if (rules.isLatitude) {
                const latitudeRegExp = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,20})?))$/;
                isValid =
                    latitudeRegExp.test(String(trimmedInput).toLowerCase()) && isValid;
            }
            if (rules.isLongitude) {
                const longitudeRegExp = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,20})?))$/;
                isValid =
                    longitudeRegExp.test(String(trimmedInput).toLowerCase()) && isValid;
            }
        }
        return isValid;
    };

    inputChangedHandler = (event, formElementId) => {
        const updatedDockForm = {
            ...this.state.dockForm,
            [formElementId]: {
                ...this.state.dockForm[formElementId],
                value: event.target.value,
                valid: this.checkValidity(
                    event.target.value,
                    this.state.dockForm[formElementId].validationRules
                ),
                touched: true,
            },
        };

        let allFieldsValid = true;
        for (let dockFormId in updatedDockForm) {
            if (!updatedDockForm[dockFormId].validationRules) {
                continue;
            }
            allFieldsValid =
                updatedDockForm[dockFormId].valid && allFieldsValid;
        }

        this.setState((oldState) => {
            return {
                ...oldState,
                dockForm: updatedDockForm,
                allFieldsValid: allFieldsValid,
            };
        });

        // check if selected address exists, update latlong and center the map around it
        if (formElementId === "address" && event.target.value !== "") {
            const address = this.state.addresses.find(
                (address) =>
                    parseInt(address.addressid) === parseInt(event.target.value)
            );
            queryAddressLatLong(address)
            // console.log(address)
                .then((latlon) => {
                    this.updateLatitudeLongitude(latlon);
                    this.setState({ mapcenter: latlon });
                })
                .catch(() => {
                    ToastMaker.errorToast(
                        "Could not resolve the address on the map. \nYou need to manually drag te marker to the location of the dock"
                    );
                });
        }
    };

    updateMarkerPosition = (event) => {
        console.log(event.target);
        console.log(event.target.getLatLng());
        if (event.target._latlng) {
            let lat = event.target._latlng.lat;
            let lon = event.target._latlng.lng;

            // fix out of bounds longitude
            if (lon > 180) {
                lon = 180;
            }
            if (lon < -180) {
                lon = -180;
            }

            const latlon = { lat: lat, lon: lon };
            this.updateLatitudeLongitude(latlon);
        }
    };

    updateLatitudeLongitude = (latlon) => {
        const fakeLatitudeEvent = { target: { value: latlon.lat } };
        const fakeLongitudeEvent = { target: { value: latlon.lon } };
        this.inputChangedHandler(fakeLatitudeEvent, "latitude");
        this.inputChangedHandler(fakeLongitudeEvent, "longitude");

        this.setState({
            markerPosition: latlon,
        });
    };

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
        this.loadAddresses();
        this.toggleAddressModal();
    };

    updateFacilities = (facilities) => {
        this.setState({ facilities: facilities });
    };

    addDockHandler = (event) => {
        if (event) {
            event.preventDefault();
        }

        const dock = {
            name: this.state.dockForm.name.value,
            addressid: this.state.dockForm.address.value,
            description: this.state.dockForm.description.value,
            length: parseFloat(
                this.state.dockForm.length.value
                    .replace(",", ".")
                    .replace("m", "")
                    .replace("M", "")
            ),
            width: parseFloat(
                this.state.dockForm.width.value
                    .replace(",", ".")
                    .replace("m", "")
                    .replace("M", "")
            ),
            price: parseFloat(
                this.state.dockForm.price.value
                    .replace(",", ".")
                    .replace("€", "")
            ),
            place: this.state.dockForm.place.value,
            latitude: parseFloat(this.state.dockForm.latitude.value),
            longitude: parseFloat(this.state.dockForm.longitude.value),
            facilities: this.state.facilities,
        };

        this.props.onAddDock(dock);
        this.props.dockManagerToMap();
        this.resetDockForm();
    };

    resetDockForm = () => {
        const resetDockForm = { ...this.state.dockForm };
        for (let inputIdentifier in this.state.dockForm) {
            if (resetDockForm[inputIdentifier].value) {
                resetDockForm[inputIdentifier].value = "";
                resetDockForm[inputIdentifier].valid = false;
                resetDockForm[inputIdentifier].touched = false;
            }
        }

        this.setState({
            dockForm: resetDockForm,
            allFieldsValid: false,
            facilities: [],
            loading: false,
            mapcenter: {
                lat: 52.16121472938702,
                lon: 4.501615852518094,
            },
            markerPosition: {
                lat: 52.16121472938702,
                lon: 4.501615852518094,
            },
        });
    };

    createInputField = (key, children) => {
        return (
            <Input
                key={key}
                wrapperClassName={
                    this.state.dockForm[key].wrapperClassName
                }
                elementType={this.state.dockForm[key].elementType}
                elementConfig={this.state.dockForm[key].elementConfig}
                value={this.state.dockForm[key].value}
                invalid={!this.state.dockForm[key].valid}
                shouldValidate={this.state.dockForm[key].validationRules}
                touched={this.state.dockForm[key].touched}
                label={this.state.dockForm[key].label}
                validationWarning={
                    this.state.dockForm[key].validationWarning
                }
                styling={this.state.dockForm[key].styling}
                changed={(event) => this.inputChangedHandler(event, key)}
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
        const address = this.createInputField("address");
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
                facilities={this.state.facilities}
                updateFacilities={this.updateFacilities}
            />
        );
        const length = this.createInputField("length");
        const width = this.createInputField("width");
        const price = this.createInputField("price");
        const place = this.createInputField("place");
        const locationTitle = <h5 key={"locationTitle"}>{"Location"}</h5>;
        const locationSubText = (
            <p key={"locationSubText"}>
                {
                    "We have pre-selected the location of the dock based on the chosen address, you can drag the marker to the exact location of the dock"
                }
            </p>
        );
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
                        onDragend={this.updateMarkerPosition}
                    ></Marker>
                </Map>
            </div>
        );
        const submitDockButton = (
            <Button
                clicked={this.addDockHandler}
                disabled={!this.state.allFieldsValid}
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
                    <AddAddress notifyAddressAdded={this.notifyAddressAdded} />
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
};

const mapStateToProps = (state) => {
    return {
        userDocks: state.dock.userDocks,
        userDocksLoading: state.dock.userDocksLoading,
        addDockLoading: state.dock.addDockLoading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAddDock: (dock) => dispatch(actions.addDock(dock)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DockCreator);
