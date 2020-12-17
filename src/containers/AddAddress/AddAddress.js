import React, {Component} from 'react';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './AddAddress.module.css';
import countryCodes from './countryCodes';
import stateCodes from './stateCodes';
import {queryAddressLatLong} from './LocationQuery';
import PropTypes from 'prop-types';
import {ApiService} from '../../components/shared/Api.service';
import Spinner from '../../components/UI/Spinner/Spinner';
import ToastMaker from "../../components/shared/ToastMaker";

class AddAddress extends Component {

    state = {
        addressForm: {

            street: {
                styling: {
                    width: "80%"
                },
                label: 'Street',
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                },
                value: '',
                validationRules: {
                    required: true,
                    maxLength: 100
                },
                validationWarning: "*required",
                valid: false,
                touched: false
            },
            houseNumber: {
                styling: {
                    width: "20%"
                },
                label: 'Number',
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                },
                value: '',
                validationRules: {
                    required: true,
                    maxLength: 100
                },
                validationWarning: "*required",
                valid: false,
                touched: false
            },
            postalcode: {
                styling: {
                    width: "50%"
                },
                label: 'Postal code',
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                },
                value: '',
                validationRules: {
                    required: true,
                    isPostalcode: true
                },
                valid: false,
                touched: false
            },
            city: {
                styling: {
                    width: "50%"
                },
                label: 'City',
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                },
                value: '',
                validationRules: {
                    required: true,
                },
                valid: false,
                touched: false
            },
            country: {
                styling: {
                    width: "50%"
                },
                label: 'Country',
                elementType: 'select',
                elementConfig: {
                    options: countryCodes()
                },
                value: 'NL',
                validationRules: {
                    required: true
                },
                valid: true,
                touched: true
            },
            state: {
                styling: {
                    width: "50%"
                },
                label: 'US State',
                elementType: 'select',
                elementConfig: {
                    options: stateCodes(),
                    placeholder: 'Select a State'
                },
                value: '',
                validationRules: {
                    required: true
                },
                valid: true,
                touched: true
            },


        },
        allFieldsValid: false,
        loading: false,
        address: null,
        badAddressWarning: false
    }

    inputChangedHandler = (event, formElementId) => {
        const updatedAddressForm = {
            ...this.state.addressForm
        }
        const updatedAddressFormElement = {
            ...updatedAddressForm[formElementId]
        }
        updatedAddressFormElement.value = event.target.value;
        updatedAddressFormElement.valid = this.checkValidity(updatedAddressFormElement.value, updatedAddressFormElement.validationRules)
        updatedAddressFormElement.touched = true;
        updatedAddressForm[formElementId] = updatedAddressFormElement

        let allFieldsValid = true
        for (let formElementId in updatedAddressForm) {
            if (!updatedAddressForm[formElementId].validationRules) {
                continue;
            }
            allFieldsValid = updatedAddressForm[formElementId].valid && allFieldsValid
        }

        this.setState({addressForm: updatedAddressForm, allFieldsValid: allFieldsValid, badAddressWarning: false})
    }


    checkValidity = (input, rules) => {
        let isValid = true

        let trimmedInput = input.trim()
        let trimmedInputLength = trimmedInput.length

        if (rules) {
            if (rules.required) {
                isValid = trimmedInput !== '';
            }

            if (rules.minLength) {
                isValid = trimmedInputLength >= rules.minLength && isValid
            }

            if (rules.maxLength) {
                isValid = trimmedInputLength <= rules.maxLength && isValid
            }

            if (rules.isEmail) {
                const emailRegExp = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                isValid = emailRegExp.test(String(trimmedInput).toLowerCase()) && isValid
            }
            if (rules.isPostalcode) {
                const postalCodeRegEx = /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i;
                isValid = postalCodeRegEx.test(String(trimmedInput).toLowerCase()) && isValid
            }
            if (rules.isMeters) {
                const metersRegExp = /^(\d+(?:[.,]\d{1,2})?)$/;
                isValid = metersRegExp.test(String(trimmedInput).toLowerCase()) && isValid
            }
            if (rules.isEuros) {
                const euroCurrencyRegExp = /^(\u20AC)?[0-9]+(,[0-9]{1,2})?$/;
                isValid = euroCurrencyRegExp.test(String(trimmedInput).toLowerCase()) && isValid
            }
            if (rules.isLatitude) {
                const latitudeRegExp = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,20})?))$/;
                isValid = latitudeRegExp.test(String(trimmedInput).toLowerCase()) && isValid
            }
            if (rules.isLongitude) {
                const longitudeRegExp = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,20})?))$/;
                isValid = longitudeRegExp.test(String(trimmedInput).toLowerCase()) && isValid
            }
        }
        return isValid;
    }

    submitForm = (event) => {
        event.preventDefault()
        this.setState({loading: true})

        if (this.state.address && this.state.badAddressWarning) {
            this.addAddress(this.state.address)
            return
        }

        const address = {
            street: this.state.addressForm.street.value,
            houseNumber: this.state.addressForm.houseNumber.value,
            postalcode: this.state.addressForm.postalcode.value.split(" ").join(""),
            city: this.state.addressForm.city.value,
            country: this.state.addressForm.country.value,
            state: this.state.addressForm.state.value,
        }

        queryAddressLatLong(address)
            .then(() => {
                this.addAddress(address)
            })
            .catch(() => {
                this.setState({address: address, badAddressWarning: true, loading: false})
            })

    }

    addAddress = (address) => {
        ApiService.post('address', address)
            .then(() => {
                // reset the form
                const UpdatedaddressForm = {
                    ...this.state.addressForm,
                    street: {
                        ...this.state.addressForm.street,
                        value: ''
                    },
                    houseNumber: {
                        ...this.state.addressForm.houseNumber,
                        value: ''
                    },
                    postalcode: {
                        ...this.state.addressForm.postalcode,
                        value: ''
                    },
                    city: {
                        ...this.state.addressForm.city,
                        value: ''
                    },
                    country: {
                        ...this.state.addressForm.country,
                        value: 'NL'
                    },
                    state: {
                        ...this.state.addressForm.state,
                        value: ''
                    },
                }
                this.setState({addressForm: UpdatedaddressForm, badAddressWarning: false, loading: false})
                this.props.notifyAddressAdded()
            })
            .catch(() => {
                ToastMaker.errorToast('Could not make a new address, look in the console for the error')
            })
    }

    render() {

        const formElementsArray = []
        for (let key in this.state.addressForm) {
            if (key === "state" && this.state.addressForm.country.value !== "US") {
                continue;
            }
            formElementsArray.push({
                id: key,
                config: this.state.addressForm[key]
            })
        }

        let form = (
            <form onSubmit={this.submitForm} className={classes.AddressForm}>
                {formElementsArray.map(formElement => {
                    return <Input
                        key={formElement.id}

                        // elelment 
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        label={formElement.config.label}

                        // validation
                        shouldValidate={formElement.config.validation}
                        invalid={!formElement.config.valid}
                        validationWarning={formElement.config.validationWarning}
                        touched={formElement.config.touched}

                        styling={formElement.config.styling}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}
                    />
                })}
                <div style={{width: "100%"}}>
                    <Button
                        disabled={!this.state.allFieldsValid}>{this.state.badAddressWarning ? "Yes continue" : "Add address"}</Button>

                </div>
            </form>
        )

        let loadingSpinner = this.state.loading ? <div className={classes.Spinner}><Spinner/></div> : null

        return (
            <div>
                <div className={classes.AddressCreator}>
                    {loadingSpinner}
                    <h5>Add a new Address</h5>
                    {form}
                    {this.state.badAddressWarning ?
                        <p className={classes.Warning}>The address entered above could not be resolved do you want to
                            continue anyway?</p> : null}
                </div>

            </div>
        )
    }
}

AddAddress.propTypes = {
    addAddress: PropTypes.func,
    notifyAddressAdded: PropTypes.func,

};

export default AddAddress;
