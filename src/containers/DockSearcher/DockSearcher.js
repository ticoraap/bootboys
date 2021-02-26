import React, { Component } from "react";
import classes from "./DockSearcher.module.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as actions from "../../store/actions/index";

import DockList from "../../components/DockList/DockList";
import Map from "../../components/Map/Map";
import ToastMaker from "../../shared/toastMaker";
import TextField from "@material-ui/core/TextField";

class DockSearcher extends Component {
    state = {
        searchName: "",
        searchPrice: "",
        searchLength: "",
        searchWidth: "",
        docks: [],
        filteredDocks: [],
        lat: 0,
        lon: 0,
        zoom: 14,
        geolocationAllowed: false,
    };

    componentDidMount() {
        this.props.onGetAllDocks();
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

    handleOnChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    getFilteredDocks = () => {
        const newFilteredDocks = [];
        for (const dock of this.props.docks) {
            let satisfiesFilter = true;

            satisfiesFilter = this.isInputInDockName(dock) && satisfiesFilter;
            satisfiesFilter =
                this.isDockPriceWithinMaxPrice(dock) && satisfiesFilter;
            satisfiesFilter =
                this.isDockLengthWithinMaxLength(dock) && satisfiesFilter;
            satisfiesFilter =
                this.isDockWidthWithinMaxWidth(dock) && satisfiesFilter;

            if (satisfiesFilter) {
                newFilteredDocks.push({ ...dock });
            }
        }
        return newFilteredDocks;
    };

    isInputInDockName = (dock) => {
        return dock.name.toLowerCase().includes(this.state.searchName);
    };

    isDockPriceWithinMaxPrice = (dock) => {
        if (this.state.searchPrice === "") {
            return true;
        }
        return dock.price <= this.state.searchPrice;
    };

    isDockLengthWithinMaxLength = (dock) => {
        if (this.state.searchLength === "") {
            return true;
        }
        return dock.searchLength >= this.state.searchLength;
    };

    isDockWidthWithinMaxWidth = (dock) => {
        if (this.state.searchWidth === "") {
            return true;
        }
        return dock.searchWidth >= this.state.searchWidth;
    };

    render() {
        const filteredDocks = this.getFilteredDocks();

        return (
            <div className={classes.DockSearcher}>
                <div className={classes.Inputs}>
                    <TextField
                        onChange={(event) => this.handleOnChange(event)}
                        value={this.state.searchName}
                        name={"searchName"}
                        label={"Name of dock"}
                        size={"medium"}
                        className={classes.InputElement}
                    />
                    <TextField
                        onChange={(event) => this.handleOnChange(event)}
                        value={this.state.searchPrice}
                        name={"searchPrice"}
                        label={"Max price in euro's"}
                        size={"medium"}
                        type={"number"}
                        className={classes.InputElement}
                    />
                    <TextField
                        onChange={(event) => this.handleOnChange(event)}
                        value={this.state.searchLength}
                        name={"searchLength"}
                        label={"Min length in meters"}
                        size={"medium"}
                        type={"number"}
                        className={classes.InputElement}
                    />
                    <TextField
                        onChange={(event) => this.handleOnChange(event)}
                        value={this.state.searchWidth}
                        name={"searchWidth"}
                        label={"Min width in meters"}
                        size={"medium"}
                        type={"number"}
                        className={classes.SearchDock}
                    />
                </div>
                <div className={classes.Content}>
                    <DockList docks={filteredDocks} />
                    <div className={classes.Map}>
                        <Map
                            className={classes.Map}
                            center={[this.state.lat, this.state.lon]}
                            zoom={this.state.zoom}
                            docks={this.props.docks}
                            boundMapToMarkers={!this.state.geolocationAllowed}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

DockSearcher.propTypes = {
    docks: PropTypes.any,
    onGetAllDocks: PropTypes.func,
};

const mapStateToProps = (state) => {
    return {
        docks: state.dock.allDocks,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onGetAllDocks: () => dispatch(actions.getAllDocks()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DockSearcher);
