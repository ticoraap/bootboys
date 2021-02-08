import React from "react";
import classes from "./Dock.module.css";
import "./calendar.css";
import { Calendar } from "react-calendar";
import ToastMaker from "../../components/shared/ToastMaker";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";

// components
import Map from "../../components/Map/Map";
import { Api } from "../../api";

export default class Dock extends React.Component {
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
        this.loadDock(this.props.location.state.id);
    }

    loadDock = (dockid) => {
        Api.dock.get(dockid).then((dock) => {
            Api.address.get(dock.addressid).then((address) => {
                dock.dockid = dockid;
                this.setState({
                    dock: dock,
                    address: address,
                });
            });
        });
    };

    reserveDock() {
        ToastMaker.infoToast("Docks cannot be reserved at this moment");
    }

    dateRangeSelectedHandler = ([beginday, endday]) => {
        if (!this.isDateRangeAvailable(beginday, endday)) return;
        console.log("daterangeisok");
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
        return this.state.dock?.price * this.state.nights;
    }

    calculateServiceFee() {
        return (this.calculateConsumerPrice() * this.state.serviceFee) / 100;
    }

    calculateTotal() {
        return this.calculateConsumerPrice() + this.calculateServiceFee();
    }

    buildFacilitiesList() {
        return this.state.dock?.facilities.map((facility) => {
            return (
                <li className={classes.listItem} key={facility.id}>
                    {facility.description}
                </li>
            );
        });
    }

    render() {
        return (
            <div className={classes.master}>
                <div className={classes.sidebyside}>
                    <div className={classes.details}>
                        <h1 className={classes.title}>
                            {this.state.dock?.name}
                        </h1>
                        <p>
                            Description: <br />
                            {this.state.dock?.description}
                        </p>
                        <p>facilities:</p>
                        <ul>{this.buildFacilitiesList()}</ul>
                        <p>
                            Lenght of the dock: {this.state.dock?.length} Meters{" "}
                            <br />
                            Width of the dock: {this.state.dock?.width} Meters
                        </p>
                    </div>
                    <div className={classes.rent}>
                        <h2>&euro;{this.state.dock?.price}/Night</h2>
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
                                &euro;{this.state.dock?.price} *{" "}
                                {this.state.nights} nights
                            </span>
                            <span className={classes.result}>
                                &euro;
                                {this.state.dock &&
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
                            Country: {this.state.address?.country} <br />
                            City: {this.state.address?.city}
                            <br />
                            Street: {this.state.address?.street}
                            <br />
                            Housenumber: {this.state.address?.houseNumber}
                            <br />
                            postalcode: {this.state.address?.postalcode}
                            <br />
                            {this.state.address?.state}
                        </p>
                    </div>
                    <div className={classes.locationMap}>
                        {this.state.dock && (
                            <Map
                                bounds
                                center={[52.16121472938702, 4.501615852518094]}
                                zoom={5}
                                docks={[this.state.dock]}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

Dock.propTypes = {
    location: PropTypes.any,
};
