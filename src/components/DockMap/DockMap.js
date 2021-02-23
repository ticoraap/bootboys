import PropTypes from "prop-types";
import React, { Component } from "react";
import classes from "./DockMap.module.css";

import ToastMaker from "../../shared/toastMaker";
import Map from "../Map/Map";

class DockMap extends Component {
    state = {
        lat: 52.143929,
        lon: 4.5603223,
        zoom: 14,
        geolocationAllowed: false,
    };

    componentDidMount() {
        this.getGeoPermissions();
    }

    getGeoPermissions = () => {
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
            this.validateGeoPerms(result.state);
        });
    };

    validateGeoPerms = (geoPermission) => {
        if (geoPermission === "granted" || geoPermission === "prompt") {
            this.getGeoLocation();
        } else {
            this.setDefaultMapCenter();
            ToastMaker.errorToast("Geolocation perms not granted");
        }
    };

    getGeoLocation() {
        navigator.geolocation.getCurrentPosition(
            (location) => {
                this.setState({
                    lat: location.coords.latitude,
                    lon: location.coords.longitude,
                    geolocationAllowed: true,
                });
            },
            () => {
                this.setDefaultMapCenter();
                if (navigator.permissions.query({ name: "geolocation" })) {
                    ToastMaker.errorToast("Geolocation perms not granted");
                } else {
                    ToastMaker.errorToast("Couldn't get current position");
                }
            }
        );
    }

    setDefaultMapCenter = () => {
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
