import PropTypes from "prop-types";
import React, { Component } from "react";
import "./DockMap.css";

import ToastMaker from "../shared/ToastMaker";
import Map from "../Map/Map";

const EXTRA_SPACE_AT_TOP = 25;
const PERCENTAGE_TO_SHRINK = 0.7;
const MOBILE_WIDTH_PX = 750;

class DockMap extends Component {
    state = {
        BASE_LAT: 52.143929,
        BASE_LON: 4.5603223,
        lat: 52.143929,
        lon: 4.5603223,
        zoom: 11,
        geolocationAllowed: false,
    };

    componentDidMount() {
        this.addWindowScrollEventListener()
        this.setMapHeight();
        this.getGeoPermissions();
    }

    componentWillUnmount() {
        this.removeWindowScrollEventListener()
    }

    addWindowScrollEventListener = () => {
        window.addEventListener("scroll", this.handleScroll);
    }

    removeWindowScrollEventListener = () => {
        window.removeEventListener("scroll", this.handleScroll);
    }
    
    handleScroll = () => {
        if (this.isNotOnMobileResolution()) {
            document.getElementById("dockMap").style.marginTop = this.addSuffix(
                window.scrollY + EXTRA_SPACE_AT_TOP,
                "px"
            );
            this.setMapHeight();
        }
    }

    getGeoPermissions = () => {
        navigator.permissions
            .query({ name: "geolocation" })
            .then(function (result) {
                return result;
            })
            .then((result) => {
                this.validateGeoPerms(result.state);
            });
    }

    validateGeoPerms = (geoPermission) => {
        if (geoPermission === "granted" || geoPermission === "prompt") {
            this.getGeoLocation();
        } else {
            this.setDefaultMapCenter();
            ToastMaker.errorToast("Geolocation perms not granted");
        }
    }

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
            lat: this.state.BASE_LAT,
            long: this.state.BASE_LON,
        });
    }

    isNotOnMobileResolution = () => {
        return window.innerWidth > MOBILE_WIDTH_PX;
    }

    addSuffix = (input, suffix) => {
        return input + suffix;
    }
    
    setMapHeight = () => {
        document.getElementById("dockMap").style.height =
            window.innerHeight * PERCENTAGE_TO_SHRINK + "px";
    }

    render() {
        return (
            <Map
                defaultOptions
                id={"dockMap"}
                center={[this.state.lat, this.state.lon]}
                zoom={this.state.zoom}
                docks={this.props.docks}
                bounds={!this.state.geolocationAllowed}
            />
        );
    }
}

export default DockMap

DockMap.propTypes = {
    docks: PropTypes.array,
};