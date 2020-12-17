import React, {Component} from 'react';
import Facility from './Facility/Facility';
import classes from './FacilityCreator.module.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import sharedMethods from '../../components/shared/SharedMethods';
import PropTypes from 'prop-types';

class FacilityCreator extends Component {

    state = {
        createFacilityForm: {
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
                validation: {
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
                validation: {
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
        formIsValid: false,
    }

    checkValidity = (value, rules) => {
        let isValid = true
        let trimmedValue = String(value).trim()
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
            if (rules.isEuros) {
                const re = /^(\u20AC)?[0-9]+(,[0-9]{1,2})?$/;
                isValid = re.test(String(trimmedValue).toLowerCase()) && isValid
            }
        }
        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {

        const updatedCreateFacilityForm = {
            ...this.state.createFacilityForm,
            [inputIdentifier]: {
                ...this.state.createFacilityForm[inputIdentifier],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.createFacilityForm[inputIdentifier].validation),
                touched: true
            }
        }

        let formIsValid = true
        for (let facilityFormIdentfier in updatedCreateFacilityForm) {
            if (!updatedCreateFacilityForm[facilityFormIdentfier].validation) {
                continue;
            }
            formIsValid = updatedCreateFacilityForm[facilityFormIdentfier].valid && formIsValid
        }

        this.setState({createFacilityForm: updatedCreateFacilityForm, formIsValid: formIsValid})
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
                price: parseFloat(this.state.createFacilityForm.price.value.replace(',', '.').replace('€', '')),
                description: this.state.createFacilityForm.description.value
            }
        )

        this.props.updateFacilities(newFacilityList)

        //reset the facilitys form
        const retsetFacilitiesForm = {
            ...this.state.createFacilityForm,
            description: {
                ...this.state.createFacilityForm.description,
                value: '',
                valid: false,
                touched: false
            },
            price: {
                ...this.state.createFacilityForm.price,
                value: '',
                valid: false,
                touched: false
            }
        }

        this.setState({createFacilityForm: retsetFacilitiesForm, formIsValid: false})
    }

    render() {



        const formElementsArray = []
        for (let key in this.state.createFacilityForm) {
            formElementsArray.push({
                id: key,
                config: this.state.createFacilityForm[key]
            })
        }

        let form = (
            <div className={classes.FacilityForm}>
                {formElementsArray.map(formElement => {

                    if (formElement.config.elementType === 'saveFacilityButton') {
                        return <Button key={formElement.id} clicked={this.addFacility} btnType="Form"
                                       disabled={!this.state.formIsValid}>Save</Button>
                    }

                    return <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
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
