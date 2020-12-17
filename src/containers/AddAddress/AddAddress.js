import React, {Component} from 'react';

import { checkInputValidity } from '../../shared/utility'

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
        this.updateAddressFormElement(event.target.value, formElementId)
        this.updateAddressFormValidity()
    }

    updateAddressFormElement = (inputElementValue, inputElementId) => {
        const updatedAddressForm = this.getUpdatedAddressForm(inputElementValue, inputElementId)
        this.setState({addressForm: updatedAddressForm})
    }

    getUpdatedAddressForm = (inputElementValue, inputElementId) => {
        const validationRules = this.state.addressForm[inputElementId].validationRules
        const isValidInput = checkInputValidity(inputElementValue, validationRules)

        const updatedAddressForm = {
            ...this.state.addressForm,
            [inputElementId]: {
                ...this.state.addressForm[inputElementId],
                value: inputElementValue,
                valid: isValidInput,
                touched :true,
            }
        }
        return updatedAddressForm
    }

    updateAddressFormValidity = () => {
        this.setState(recentState => {
            const allFieldsValid = this.isFormValid(recentState.addressForm)
            return {allFieldsValid: allFieldsValid, badAddressWarning: false} 
        })
    }

    isFormValid = (addressForm) => {
        let allFieldsValid = true
        for (let formElement of Object.values(addressForm)) {
            if (formElement.validationRules) {
                allFieldsValid = allFieldsValid && formElement.valid 
            }
        }
        return allFieldsValid
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
