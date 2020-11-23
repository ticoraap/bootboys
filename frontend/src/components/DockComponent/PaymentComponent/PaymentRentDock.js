import React, {Component} from "react";
import PropTypes from "prop-types";
import {ApiService} from "../../shared/Api.service";
import sharedMethods from "../../shared/SharedMethods";
import CheckoutForm from "./CheckoutForm";


export default class PaymentRentDock extends Component {


    static get propTypes() {
        return {
            location: PropTypes.any
        };
    }

    componentDidMount() {
        const dockId = this.props.location.state.id
        const selectedDateRange = this.props.location.state.selectedDateRange
        const arrivalDate = this.getSendableDate(selectedDateRange[0])
        const departureDate = this.getSendableDate(selectedDateRange[1])
        const metaData = this.createMetadata()
        sessionStorage.setItem('dockId', this.props.location.state.id)
        sessionStorage.setItem('arrivalDate', this.getSendableDate(selectedDateRange[0]))
        sessionStorage.setItem('departureDate', this.getSendableDate(selectedDateRange[1]))
        sessionStorage.setItem('metaData', JSON.stringify(this.createMetadata()))
       ApiService.post('/create-payment-intent', {
            dockId: dockId,
            arrivalDate: arrivalDate,
            departureDate: departureDate,
            metaData: metaData,
            tenantId: this.getTenantID(),
        }).then(res => res.json()).then(
            data => sessionStorage.setItem('key', data.clientSecret)
        )
    }

    getTenantID(){
        return JSON.parse(localStorage.getItem('currentUser')).userid
    }

    getSendableDate(fullDateInput) {
        const fullDate = new Date(fullDateInput)
        return fullDate.getDate() + '-' + this.getCorrectMonthNumberZeroIndexed(fullDate) + '-' + fullDate.getFullYear()
    }

    getCorrectMonthNumberZeroIndexed(fullDate){
        // Maker of this decided months start at 0 so add 1
        return (fullDate.getMonth() + 1)
    }

    render() {
        return (
            <CheckoutForm dockId={this.dockId}
                          arrivalDate={this.arrivalDate}
                          departureDate={this.departureDate}
                          metaData={this.metaData}/>
        );
    }

    createMetadata() {
        const user = sharedMethods.parseJSON(localStorage.getItem('currentUser'))
        return {
            'Customer Name': user.firstname + ' ' + user.surname,
            'Username': user.username,
            'Phone Number': user.phonenumber,
            'Mail Address': user.mail,
            'User ID': user.userid
        };
    }
}
