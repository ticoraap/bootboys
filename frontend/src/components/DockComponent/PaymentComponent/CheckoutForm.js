import React from 'react';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
import './checkoutForm.css'
import CardSection from './CardSection';
import ToastMaker from "../../shared/ToastMaker";
import Button from "@material-ui/core/Button";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    let disabled = false

    const handleSubmit = async (event) => {
        event.preventDefault();
        document.getElementById('payForDockButton').setAttribute('disabled', 'true')
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        const user = JSON.parse(localStorage.getItem('currentUser'))
        const result = await stripe.confirmCardPayment(sessionStorage.getItem('key'), {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: user.firstname + ' ' + user.surname,
                    email: user.mail,
                    phone: user.phonenumber,
                },
            }
        });
        document.getElementById('payForDockButton').removeAttribute('disabled')
        if (result.error) {

            ToastMaker.errorToast(result.error.message)
        } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
                // Show a success message to your customer
                // There's a risk of the customer closing the window before callback
                // execution. Set up a webhook or plugin to listen for the
                // payment_intent.succeeded event that handles any business critical
                // post-payment actions.
                ToastMaker.successToast('Payment Successfully')
            }else{
                ToastMaker.errorToast(result.paymentIntent.status)
                ToastMaker.errorToast(result.error.message)
            }
        }
    };

    return (
        <div>
            <h1>Payment for rental of dock: {sessionStorage.getItem('dockName')}</h1>
            <h2>Arrival date: {sessionStorage.getItem('arrivalDate')}.</h2>
            <h2>Departure date: {sessionStorage.getItem('departureDate')}.</h2>
            <h3>You have 1 hour to finish your payment, after that others can reserve the dock again.</h3>
            <h3>Dont leave this page until your payment is successfully</h3>
            <form onSubmit={handleSubmit}>
                <CardSection />
                <Button type={'submit'} id={'payForDockButton'} disabled={!stripe || disabled}>Confirm order</Button>
            </form>
        </div>
    );
}
