import React, { Component } from "react";
import classes from "./LocationEditor.module.css";

import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";

import Input from "../../../components/UI/InputCom/InputCom";
import Select from "../../../components/UI/Select/Select";
import Button from "../../../components/UI/Button/Button";
import { queryAddressLatLong } from "../../AddressCreator/LocationQuery";
import ToastMaker from "../../../shared/toastMaker";

import { Map, Marker, TileLayer } from "react-leaflet";

class LocationEditor extends Component {
    state = {
        addressid: { value: "", valid: false },
        latitude: { value: "0", valid: false },
        longitude: { value: "0", valid: false },
        allowEdit: false,
        markerPosition: {
            lat: 0,
            lon: 0,
        },
        mapcenter: {
            lat: 0,
            lon: 0,
        },
        allFieldsValid: false,
    };

    componentDidMount() {
        this.props.onLoadUserAddresses();
    }

    onInputChange = (id, value, valid) => {
        this.setState({
            [id]: { value: value, valid: valid },
        });
        this.isLocationValid();
    };

    isLocationValid = () => {
        this.setState(
            (prevState) => {
                return {
                    allFieldsValid:
                        prevState.addressid.valid &&
                        prevState.latitude.valid &&
                        prevState.longitude.valid,
                };
            },
            () => {
                this.props.setLocationDetails(
                    this.state.addressid.value,
                    this.state.latitude.value,
                    this.state.longitude.value,
                    this.state.allFieldsValid
                );
            }
        );
    };

    mapAddressesToOptions = () => {
        return this.props.userAddresses.map((address) => ({
            value: address.addressid,
            displayValue: address.street + " " + address.houseNumber,
        }));
    };

    onSelectChange = (id, value, valid) => {
        this.onInputChange(id, value, valid);
        if (value === "") return;
        const address = this.getAddressFromId(value);
        this.updateLatLonWithAddress(address);
    };

    getAddressFromId = (addressid) => {
        return this.props.userAddresses.find(
            (address) => address.addressid === addressid
        );
    };

    updateLatLonWithAddress = (address) => {
        queryAddressLatLong(address)
            .then(({ lat, lon }) => {
                this.onInputChange("latitude", lat, true);
                this.onInputChange("longitude", lon, true);
            })
            .catch(() => {
                ToastMaker.warnToast(
                    "Could not resolve the address on the map. \nYou need to manually drag te marker to the location of the dock"
                );
            });
    };

    dragMarkerHandler = (event) => {
        if (!event.target._latlng) return;

        let latlon = this.keepLatLonInBounds({
            lat: event.target._latlng.lat,
            lon: event.target._latlng.lng,
        });

        this.onInputChange("latitude", latlon.lat, true);
        this.onInputChange("longitude", latlon.lon, true);
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

    onToggleEdit = () => {
        this.setState({
            allowEdit: !this.state.allowEdit,
        });
    };

    render() {
        return (
            <div className={classes.LocationEditor}>
                <h5>Location</h5>
                <p>
                    We have pre-selected the location of the dock based on the
                    chosen address, you can drag the marker to the exact
                    location of the dock
                </p>
                <Select
                    className={classes.Select}
                    id="addressid"
                    value={this.state.addressid.value}
                    label="Address"
                    placeholder="Select a address first"
                    invalidMessage="Please select a country"
                    options={this.mapAddressesToOptions()}
                    notifyParentOfChange={this.onSelectChange}
                />
                <Button btnType="Form" clicked={this.onToggleEdit}>
                    Edit
                </Button>
                <Input
                    className={classes.LatLon}
                    id="latitude"
                    type="text"
                    value={this.state.latitude.value}
                    label="Latitude"
                    validationRules={{
                        required: true,
                    }}
                    notifyParentOfChange={this.onInputChange}
                    disabled={!this.state.allowEdit}
                />
                <Input
                    className={classes.LatLon}
                    id="longitude"
                    type="text"
                    value={this.state.longitude.value}
                    label="Longitude"
                    validationRules={{
                        required: true,
                    }}
                    notifyParentOfChange={this.onInputChange}
                    disabled={!this.state.allowEdit}
                />

                <div className={classes.Leaflet}>
                    <Map
                        center={{
                            lat: Number(this.state.latitude.value),
                            lon: Number(this.state.longitude.value),
                        }}
                        zoom={20}
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            noWrap
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                            position={{
                                lat: Number(this.state.latitude.value),
                                lon: Number(this.state.longitude.value),
                            }}
                            draggable
                            onDragend={this.dragMarkerHandler}
                        ></Marker>
                    </Map>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userAddresses: state.address.userAddresses,
        userAddressesLoading: state.address.userAddressesLoading,
        addAddressLoading: state.address.addAddressLoading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadUserAddresses: () => dispatch(actions.getUserAddresses()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationEditor);
