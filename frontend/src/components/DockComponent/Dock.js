import React from "react";
import { ApiService } from "../shared/Api.service";
import { handleResponse } from "../LoginComponent/handle-response";
import classes from "./Dock.module.css";
import "./calendar.css";
import { Calendar } from "react-calendar";
// import io from "socket.io-client";
import ToastMaker from "../shared/ToastMaker";
import PropTypes from "prop-types";
import sharedMethods from "../shared/SharedMethods";
import SingleDockMap from "./SingleDockMap";
import { Button } from "@material-ui/core";
import { authenticationService } from "../LoginComponent/authentication.service";
import { Redirect } from "react-router-dom";

export default class Dock extends React.Component {
    MILISECONDS_IN_DAY = 86400000;

    cardElementOptions = {
        iconStyle: "solid",
        hidePostalCode: true,
    };

    constructor() {
        super();
        this.SingleDockMap = React.createRef();
        this.state = {
            dock: "",
            address: {
                country: "",
                city: "",
                street: "",
                houseNumber: "",
                postalcode: "",
                state: "",
            },
            nights: 0,
            serviceFee: 50,
            rentedAt: [],
            selectedDateRange: null,
            socket: null,
            redirect: false,
            facilities: [],
            addressloaded: false,
            addressloading: false,
        };
    }

    render() {
        if (this.state.redirect) {
            return (
                <Redirect
                    to={{
                        pathname: "/pay",
                        state: {
                            id: this.props.location.state.id,
                            selectedDateRange: this.state.selectedDateRange,
                        },
                    }}
                />
            );
        }
        return (
            <div className={classes.master}>
                <div className={classes.sidebyside}>
                    <div className={classes.details}>
                        <h1 className={classes.title}>
                            {this.state.dock.name}
                        </h1>
                        <p>
                            Description: <br />
                            {this.state.dock.description}
                        </p>
                        <p>facilities:</p>
                        <ul>{this.buildFacilitiesList()}</ul>
                        <p>
                            Lenght of the dock: {this.state.dock.length} Meters{" "}
                            <br />
                            Width of the dock: {this.state.dock.width} Meters
                        </p>
                    </div>
                    <div className={classes.rent}>
                        <h2>&euro;{this.state.dock.price}/Night</h2>
                        <Calendar
                            selectRange={true}
                            maxDetail="month"
                            minDetail="year"
                            onChange={this.calculateNights.bind(this)}
                            minDate={new Date()}
                            tileDisabled={({ date }) =>
                                this.state.rentedAt.includes(date.getTime())
                            }
                            value={this.state.selectedDateRange}
                        />
                        <div className={classes.sidebyside}>
                            <span>
                                &euro;{this.state.dock.price} *{" "}
                                {this.state.nights} nights
                            </span>
                            <span className={classes.result}>
                                &euro;{this.calculateConsumerPrice()}
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
                            Country: {this.state.address.country} <br />
                            City: {this.state.address.city}
                            <br />
                            Street: {this.state.address.street}
                            <br />
                            Housenumber: {this.state.address.houseNumber}
                            <br />
                            postalcode: {this.state.address.postalcode}
                            <br />
                            {this.state.address.state}
                        </p>
                    </div>
                    <div className={classes.locationMap}>
                        <SingleDockMap ref={this.SingleDockMap} />
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        ApiService.get("dock/" + this.props.location.state.id)
            .then(handleResponse)
            .then((data) => {
                this.SingleDockMap.current.updateMap(
                    data.latitude,
                    data.longitude
                );
                this.disableAllRentedDays(data[2]);
                this.setState({
                    dock: data,
                    facilities: data.facilities,
                });
                if (!this.state.addressloaded && !this.state.addressloading) {
                    this.setState({ addressloading: true });
                    ApiService.get("address/" + data.addressid)
                        .then(handleResponse)
                        .then((data) => {
                            console.log(data);
                            this.setState({
                                addressloading: false,
                                addressloaded: true,
                                address: data
                            });
                        });
                }
            });
        this.setupSocket();
    }

    reserveDock() {
        if (!authenticationService.checkIfLoggedIn()) {
            ToastMaker.errorToast("You have to be logged in to rent a dock.");
        } else if (this.checkIfDateIsFilledCorrectlyAndGiveFeedback()) {
            sessionStorage.setItem("dockName", this.state.dock.name);
            this.setState({
                redirect: true,
            });
        } else {
            ToastMaker.errorToast("Invalid dates picked");
        }
    }

    checkIfDateIsFilledCorrectlyAndGiveFeedback() {
        return this.state.nights >= 1;
    }

    calculateNights(days) {
        if (!this.checkAvailableDays(days)) {
            ToastMaker.errorToast(
                "Please select a period that doesnt have days that are already rented out"
            );
            this.setState({
                nights: 0,
                selectedDateRange: null,
            });
            return;
        }
        this.setState({
            selectedDateRange: days,
        });
        let timeBetweenDaysInMili = days[1] - days[0];
        let nights = Math.round(
            timeBetweenDaysInMili / this.MILISECONDS_IN_DAY - 1
        );
        this.setState({
            nights: nights,
        });
    }

    calculateConsumerPrice() {
        return this.state.dock.price * this.state.nights;
    }

    calculateServiceFee() {
        return (this.calculateConsumerPrice() * this.state.serviceFee) / 100;
    }

    calculateTotal() {
        return this.calculateConsumerPrice() + this.calculateServiceFee();
    }

    checkAvailableDays(days) {
        for (let i of this.state.rentedAt) {
            if (i > days[0].getTime() && i < days[1].getTime()) {
                return false;
            }
        }
        return true;
    }

    setupSocket() {
        // this.setState({
        //     socket: io.connect(sharedMethods.getURL('/dock'))
        // }, () => {
        //     this.registerSocketListener()
        // })
    }

    registerSocketListener() {
        const socket = this.state.socket;
        socket.on("dockHasBeenRented", (data) => {
            const jsonFormat = sharedMethods.parseJSON(data);
            if (jsonFormat["dockid"] !== this.state.dock.dockid) {
                return;
            }
            let days = this.createArrayOfDays(
                jsonFormat["arrivaldate"],
                jsonFormat["departuredate"]
            );
            this.setState({ rentedAt: this.state.rentedAt.concat(days) });
            ToastMaker.warnToast(
                "Somebody just rented this dock from " +
                    jsonFormat["arrivaldate"] +
                    " till " +
                    jsonFormat["departuredate"]
            );
        });
    }

    calculateDaysInBetweenArrivalAndDeparture(arrivaldate, departuredate) {
        let timeInbetweenInMiliSeconds = departuredate - arrivaldate;
        return timeInbetweenInMiliSeconds / this.MILISECONDS_IN_DAY;
    }

    createArrayOfDays(arrivaldate, departuredate) {
        let days = [
            new Date(arrivaldate).getTime(),
            new Date(departuredate).getTime(),
        ];
        let numberOfDays = this.calculateDaysInBetweenArrivalAndDeparture(
            days[0],
            days[1]
        );
        let i = 1;
        while (i <= numberOfDays) {
            days.push(days[0] + this.MILISECONDS_IN_DAY * i);
            i++;
        }
        return days;
    }

    componentWillUnmount() {
        try {
            this.state.socket.disconnect();
        } catch (e) {
            console.log(e);
        }
    }

    disableAllRentedDays(dates) {
        let disabledDays = [];
        for (let i in dates) {
            disabledDays = disabledDays.concat(
                this.createArrayOfDays(dates[i][0], dates[i][1])
            );
        }
        this.setState({ rentedAt: this.state.rentedAt.concat(disabledDays) });
    }

    buildFacilitiesList() {
        return this.state.facilities.map((facility) => {
            return (
                <li className={classes.listItem} key={facility.id}>
                    {facility.description}
                </li>
            );
        });

        // for (let i in facilitiesObject){
        //     let value = facilitiesObject[i]
        //     facilitieListElement.push(
        //         <li className={classes.listItem} key={value}>{value}</li>
        //     )
        // }
        // this.setState({
        //     facilitiesToDisplay: facilitieListElement
        // })
    }

    static get propTypes() {
        return {
            location: PropTypes.any,
        };
    }
}
