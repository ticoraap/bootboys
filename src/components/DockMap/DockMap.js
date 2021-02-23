import PropTypes from "prop-types";
import React, { Component } from "react";
import classes from "./DockMap.module.css";

import ToastMaker from "../../shared/toastMaker";
import Map from "../Map/Map";

class DockMap extends Component {
    state = {
        lat: 0,
        lon: 0,
        zoom: 14,
        geolocationAllowed: false,
    };

    componentDidMount() {
        this.getGeoLocation();
    }

    getGeoLocation = () => {
        if (typeof navigator === "undefined") return;
        navigator.geolocation.getCurrentPosition(
            this.setCurrentGeoLocation,
            this.noGeoLocation
        );
    };

    setCurrentGeoLocation = (location) => {
        this.setState({
            lat: location.coords.latitude,
            lon: location.coords.longitude,
            geolocationAllowed: true,
        });
    };

    noGeoLocation = () => {
        if (navigator.permissions.query({ name: "geolocation" })) {
            ToastMaker.infoToast("Geolocation perms not granted");
        } else {
            ToastMaker.warnToast("Couldn't get current position");
        }
        this.setState({
            lat: 52.143929,
            long: 4.5603223,
        });
    };

    render() {
        return (
            <Map
                className={classes.Map}
                center={[this.state.lat, this.state.lon]}
                zoom={this.state.zoom}
                docks={this.props.docks}
                boundMapToMarkers={!this.state.geolocationAllowed}
            />
        );
    }
}

export default DockMap;

DockMap.propTypes = {
    docks: PropTypes.array,
};
