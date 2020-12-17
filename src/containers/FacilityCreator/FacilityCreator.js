import React, {Component} from 'react';
import Facility from './Facility/Facility';
import classes from './FacilityCreator.module.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import sharedMethods from '../../components/shared/SharedMethods';
import PropTypes from 'prop-types';

class FacilityCreator extends Component {

    state = {
        facilityForm: {
            description: {
                styling: {
                    width: "100%"
                },
                label: 'Description',
                elementType: 'textArea',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Describe the facility you offer:'
                },
                value: '',
                validationWarning: "Please enter a description not greater then 500 chars",
                validationRules: {
                    required: true,
                    maxLength: 500
                },
                valid: false,
                touched: false
            },
            price: {
                styling: {
                    width: "40%"
                },
                label: 'Price',
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Example: 25 or €29,99'
                },
                value: '',
                validationWarning: "Please enter a price in euros Example: 25 or €29,99",
                validationRules: {
                    required: true,
                    isEuros: true
                },
                valid: false,
                touched: false
            },
            saveFacility: {
                elementType: 'saveFacilityButton',
            },
        },
        allFieldsValid: false,
    }

    checkValidity = (input, rules) => {
        let isValid = true
        let trimmedInput = String(input).trim()
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
            if (rules.isEuros) {
                const euroCurrencyRegExp = /^(\u20AC)?[0-9]+(,[0-9]{1,2})?$/;
                isValid = euroCurrencyRegExp.test(String(trimmedInput).toLowerCase()) && isValid
            }
        }
        return isValid;
    }

    inputChangedHandler = (event, formElementId) => {

        const updatedCreateFacilityForm = {
            ...this.state.facilityForm,
            [formElementId]: {
                ...this.state.facilityForm[formElementId],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.facilityForm[formElementId].validationRules),
                touched: true
            }
        }

        let allFieldsValid = true
        for (let formElementId in updatedCreateFacilityForm) {
            if (!updatedCreateFacilityForm[formElementId].validationRules) {
                continue;
            }
            allFieldsValid = updatedCreateFacilityForm[formElementId].valid && allFieldsValid
        }

        this.setState({facilityForm: updatedCreateFacilityForm, allFieldsValid: allFieldsValid})
    }

    deleteFacility = (id) => {
        const facilityList = this.props.facilities
        const filteredFacilityList = facilityList.filter(facility => facility.id !== id)
        this.setState({facilities: filteredFacilityList})
        this.props.updateFacilities(filteredFacilityList)
    }

    addFacility = (event) => {
        event.preventDefault()
        const newFacilityList = [...this.props.facilities]
        newFacilityList.push(
            {
                id: sharedMethods.generateRandomString(),
                price: parseFloat(this.state.facilityForm.price.value.replace(',', '.').replace('€', '')),
                description: this.state.facilityForm.description.value
            }
        )

        this.props.updateFacilities(newFacilityList)

        //reset the facilitys form
        const retsetFacilitiesForm = {
            ...this.state.facilityForm,
            description: {
                ...this.state.facilityForm.description,
                value: '',
                valid: false,
                touched: false
            },
            price: {
                ...this.state.facilityForm.price,
                value: '',
                valid: false,
                touched: false
            }
        }

        this.setState({facilityForm: retsetFacilitiesForm, allFieldsValid: false})
    }

    render() {

        const formElementsArray = []
        for (let key in this.state.facilityForm) {
            formElementsArray.push({
                id: key,
                config: this.state.facilityForm[key]
            })
        }

        let form = (
            <div className={classes.FacilityForm}>
                {formElementsArray.map(formElement => {

                    if (formElement.config.elementType === 'saveFacilityButton') {
                        return <Button key={formElement.id} clicked={this.addFacility} btnType="Form"
                                       disabled={!this.state.allFieldsValid}>Save</Button>
                    }

                    return <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validationRules}
                        touched={formElement.config.touched}
                        label={formElement.config.label}
                        validationWarning={formElement.config.validationWarning}
                        styling={formElement.config.styling}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}
                    />
                })}

            </div>
        )

        const facilities = this.props.facilities.map(facility => {
            return <Facility deleteFacility={() => this.deleteFacility(facility.id)} key={facility.id}
                             price={facility.price} description={facility.description}/>
        })

        return (
            <div className={classes.FacilityCreator}>
                {facilities}
                {form}
            </div>
        )
    }
}

FacilityCreator.propTypes = {
    facilities: PropTypes.array,
    updateFacilities: PropTypes.func,
};

export default FacilityCreator;
