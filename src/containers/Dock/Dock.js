import React from "react";
import classes from "./Dock.module.css";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

import "./calendar.css";
import { Calendar } from "react-calendar";
import ToastMaker from "../../shared/toastMaker";
import { Button } from "@material-ui/core";

import Map from "../../components/Map/Map";

class Dock extends React.Component {
    MILISECONDS_IN_DAY = 86400000;

    state = {
        dock: null,
        address: null,
        nights: 0,
        serviceFee: 50,
        rentedAt: [],
        selectedDateRange: null,
    };

    componentDidMount() {
        this.props.onGetDockWithAddressById(this.props.match.params.dockid);
    }

    reserveDock() {
        ToastMaker.infoToast("Docks cannot be reserved at this moment");
    }

    dateRangeSelectedHandler = ([beginday, endday]) => {
        if (!this.isDateRangeAvailable(beginday, endday)) return;
        this.setState({
            selectedDateRange: [beginday, endday],
            nights: this.calculateNumberOfNightsInDateRange(beginday, endday),
        });
    };

    isDateRangeAvailable = (beginday, endday) => {
        if (this.isDaterangeFreeOfOtherReservations(beginday, endday))
            return true;
        this.showInfoMessageDaysAlreadyTaken();
        this.resetDateSelection();
        return false;
    };

    isDaterangeFreeOfOtherReservations(beginday, endday) {
        for (let reservedDay of this.state.rentedAt) {
            if (
                reservedDay > beginday.getTime() &&
                reservedDay < endday.getTime()
            ) {
                return false;
            }
        }
        return true;
    }

    showInfoMessageDaysAlreadyTaken = () => {
        ToastMaker.infoToast(
            "Please select a period that doesnt have days that are already rented out"
        );
    };

    resetDateSelection = () => {
        this.setState({
            nights: 0,
            selectedDateRange: null,
        });
    };

    calculateNumberOfNightsInDateRange = (beginday, endday) => {
        let timeBetweenDaysInMili = endday - beginday;
        let nights = Math.round(
            timeBetweenDaysInMili / this.MILISECONDS_IN_DAY - 1
        );
        return nights;
    };

    calculateConsumerPrice() {
        return this.props.dockWithAddress?.price * this.state.nights;
    }

    calculateServiceFee() {
        return (this.calculateConsumerPrice() * this.state.serviceFee) / 100;
    }

    calculateTotal() {
        return this.calculateConsumerPrice() + this.calculateServiceFee();
    }

    buildFacilitiesList() {
        if (this.props.dockWithAddress != null) {
            return this.props.dockWithAddress.facilities.map((facility) => {
                return (
                    <li className={classes.listItem} key={facility.id}>
                        {facility.description} €{facility.price}
                    </li>
                );
            });
        }
    }

    render() {
        return (
            <div className={classes.master}>
                <div className={classes.sidebyside}>
                    <div className={classes.details}>
                        <h1 className={classes.title}>
                            {this.props.dockWithAddress?.name}
                        </h1>
                        <p>
                            Description: <br />
                            {this.props.dockWithAddress?.description}
                        </p>
                        <p>facilities:</p>
                        <ul>{this.buildFacilitiesList()}</ul>
                        <p>
                            Lenght of the dock:{" "}
                            {this.props.dockWithAddress?.length} Meters <br />
                            Width of the dock:{" "}
                            {this.props.dockWithAddress?.width} Meters
                        </p>
                    </div>
                    <div className={classes.rent}>
                        <h2>&euro;{this.props.dockWithAddress?.price}/Night</h2>
                        <Calendar
                            selectRange={true}
                            maxDetail="month"
                            minDetail="year"
                            onChange={this.dateRangeSelectedHandler}
                            minDate={new Date()}
                            tileDisabled={({ date }) =>
                                this.state.rentedAt.includes(date.getTime())
                            }
                            value={this.state.selectedDateRange}
                        />
                        <div className={classes.sidebyside}>
                            <span>
                                &euro;{this.props.dockWithAddress?.price} *{" "}
                                {this.state.nights} nights
                            </span>
                            <span className={classes.result}>
                                &euro;
                                {this.props.dockWithAddress &&
                                    this.calculateConsumerPrice()}
                            </span>
                        </div>
                        <br />
                        <div className={classes.sidebyside}>
                            <span>ServiceFee of {this.state.serviceFee}%</span>
                            <span className={classes.result}>
                                &euro;{this.calculateServiceFee()}
                            </span>
                        </div>
                        <div className={classes.total}>
                            <span>Total</span>
                            <span className={classes.result}>
                                &euro;{this.calculateTotal()}
                            </span>
                        </div>
                        <Button onClick={() => this.reserveDock()}>
                            Rent dock
                        </Button>
                    </div>
                </div>
                <div className={classes.location}>
                    <div className={classes.locationDetails}>
                        <p>
                            Country:{" "}
                            {this.props.dockWithAddress?.address?.country}{" "}
                            <br />
                            City: {this.props.dockWithAddress?.address?.city}
                            <br />
                            Street:{" "}
                            {this.props.dockWithAddress?.address?.street}
                            <br />
                            Housenumber:{" "}
                            {this.props.dockWithAddress?.address?.houseNumber}
                            <br />
                            postalcode:{" "}
                            {this.props.dockWithAddress?.address?.postalcode}
                            <br />
                            {this.props.dockWithAddress?.address?.state}
                        </p>
                    </div>
                    <div className={classes.locationMap}>
                        {this.props.dockWithAddress && (
                            <Map
                                boundMapToMarkers
                                docks={[this.props.dockWithAddress]}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        dockWithAddress: state.dock.dockWithAddress,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onGetDockWithAddressById: (dockid) =>
            dispatch(actions.getDockWithAddressById(dockid)),
    };
};

Dock.propTypes = {
    location: PropTypes.any,
    match: PropTypes.any,
    onGetDockWithAddressById: PropTypes.func,
    dockWithAddress: PropTypes.any,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dock);
