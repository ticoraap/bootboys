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
        createAddressForm: {

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
                validation: {
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
                validation: {
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
                validation: {
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
                validation: {
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
                validation: {
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
                validation: {
                    required: true
                },
                valid: true,
                touched: true
            },


        },
        formIsValid: false,
        loading: false,
        address: null,
        badAddressWarning: false
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedCreateAddressForm = {
            ...this.state.createAddressForm
        }
        const updatedCreateAddressFormElement = {
            ...updatedCreateAddressForm[inputIdentifier]
        }
        updatedCreateAddressFormElement.value = event.target.value;
        updatedCreateAddressFormElement.valid = this.checkValidity(updatedCreateAddressFormElement.value, updatedCreateAddressFormElement.validation)
        updatedCreateAddressFormElement.touched = true;
        updatedCreateAddressForm[inputIdentifier] = updatedCreateAddressFormElement

        let formIsValid = true
        for (let inputIdentfier in updatedCreateAddressForm) {
            if (!updatedCreateAddressForm[inputIdentfier].validation) {
                continue;
            }
            formIsValid = updatedCreateAddressForm[inputIdentfier].valid && formIsValid
        }

        this.setState({createAddressForm: updatedCreateAddressForm, formIsValid: formIsValid, badAddressWarning: false})
    }


    checkValidity = (value, rules) => {
        let isValid = true

        let trimmedValue = value.trim()
        let trimmedValueLength = trimmedValue.length

        if (rules) {
            if (rules.required) {
                isValid = trimmedValue !== '';
            }

            if (rules.minLength) {
                isValid = trimmedValueLength >= rules.minLength && isValid
            }

            if (rules.maxLength) {
                isValid = trimmedValueLength <= rules.maxLength && isValid
            }

            if (rules.isEmail) {
                const re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                isValid = re.test(String(trimmedValue).toLowerCase()) && isValid
            }
            if (rules.isPostalcode) {
                const re = /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i;
                isValid = re.test(String(trimmedValue).toLowerCase()) && isValid
            }
            if (rules.isMeters) {
                const re = /^(\d+(?:[.,]\d{1,2})?)$/;
                isValid = re.test(String(trimmedValue).toLowerCase()) && isValid
            }
            if (rules.isEuros) {
                const re = /^(\u20AC)?[0-9]+(,[0-9]{1,2})?$/;
                isValid = re.test(String(trimmedValue).toLowerCase()) && isValid
            }
            if (rules.isLatitude) {
                const re = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,20})?))$/;
                isValid = re.test(String(trimmedValue).toLowerCase()) && isValid
            }
            if (rules.isLongitude) {
                const re = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,20})?))$/;
                isValid = re.test(String(trimmedValue).toLowerCase()) && isValid
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
            street: this.state.createAddressForm.street.value,
            houseNumber: this.state.createAddressForm.houseNumber.value,
            postalcode: this.state.createAddressForm.postalcode.value.split(" ").join(""),
            city: this.state.createAddressForm.city.value,
            country: this.state.createAddressForm.country.value,
            state: this.state.createAddressForm.state.value,
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
                const UpdatedcreateAddressForm = {
                    ...this.state.createAddressForm,
                    street: {
                        ...this.state.createAddressForm.street,
                        value: ''
                    },
                    houseNumber: {
                        ...this.state.createAddressForm.houseNumber,
                        value: ''
                    },
                    postalcode: {
                        ...this.state.createAddressForm.postalcode,
                        value: ''
                    },
                    city: {
                        ...this.state.createAddressForm.city,
                        value: ''
                    },
                    country: {
                        ...this.state.createAddressForm.country,
                        value: 'NL'
                    },
                    state: {
                        ...this.state.createAddressForm.state,
                        value: ''
                    },
                }
                this.setState({createAddressForm: UpdatedcreateAddressForm, badAddressWarning: false, loading: false})
                this.props.notifyAddressAdded()
            })
            .catch(() => {
                ToastMaker.errorToast('Could not make a new address, look in the console for the error')
            })
    }

    render() {

        const formElementsArray = []
        for (let key in this.state.createAddressForm) {
            if (key === "state" && this.state.createAddressForm.country.value !== "US") {
                continue;
            }
            formElementsArray.push({
                id: key,
                config: this.state.createAddressForm[key]
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
                        disabled={!this.state.formIsValid}>{this.state.badAddressWarning ? "Yes continue" : "Add address"}</Button>

                </div>
            </form>
        )

        let spinner = this.state.loading ? <div className={classes.Spinner}><Spinner/></div> : null

        return (
            <div>
                <div className={classes.AddressCreator}>
                    {spinner}
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
