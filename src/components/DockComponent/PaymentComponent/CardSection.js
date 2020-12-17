import React from 'react';
import {CardElement} from '@stripe/react-stripe-js';
import './CardSectionStyles.css'

const CARD_ELEMENT_OPTIONS = {
    hidePostalCode:true,
    style: {
        base: {
            fontWeight: 500,
            fontFamily: 'Comic Sans MS, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            lineHeight: '40px',
            ':-webkit-autofill': {
                color: '#fce883',
            },
            '::placeholder': {
                color: 'black',
            },
        },
        invalid: {
            iconColor: 'red',
            color: 'red',
        },
    },
};

function CardSection() {
    return (
        <div id={'fullHeightPayment'}>
            <div id={'paymentInput'}>
                <label id={'cardDetailsLabel'}>
                    Card details:
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </label>
            </div>
        </div>
    );
}

export default CardSection;
