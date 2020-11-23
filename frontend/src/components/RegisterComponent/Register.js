import React, {Component} from "react";
import './Register.css';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {makeStyles} from '@material-ui/core/styles';
import {sha256} from "js-sha256";
import {authenticationService} from "../LoginComponent/authentication.service";
import {ApiService} from "../shared/Api.service";
import PropTypes from 'prop-types';
import sharedMethods from "../shared/SharedMethods";
import ToastMaker from "../shared/ToastMaker";

export default class Register extends Component {

    state = {
        username: '',
        password: '',
        firstname: '',
        surname: '',
        email: '',
        phone: '',
        submit: false,
    }

    somethingWentWrongMessage = 'Something went wrong please try again. If this keeps happening please contact us'

    render() {
        const classes = makeStyles((theme) => ({
            root: {
                '& > *': {
                    margin: theme.spacing(1),
                    width: '25ch',
                },
                'TextField': {
                    backgroundColor: 'red',
                }
            },
            modal: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            },
            paper: {
                backgroundColor: theme.palette.background.paper,
                border: '2px solid #000',
                boxShadow: theme.shadows[5],
                padding: theme.spacing(2, 4, 3),
            },
        }));

        return (
            <div className={'noRemove'}>
                <div id={'modalSignUp'} className={'noRemove'} ref={node => {
                    this.pop = node
                }}>
                    <span className={'closeModal'} onClick={() => this.props.toggleModal('showRegister')}>&times;</span>
                    <h1>Sign up</h1>
                    <hr/>
                    <form className={classes.root} noValidate autoComplete="off" onSubmit={this.submitForm.bind(this)}>
                        <TextField required id={"username"} className={'input halfLength'} type={'text'}
                                   label={'Username'} variant={'outlined'}
                                   autoFocus={true} value={this.state.username}
                                   onChange={this.handleOnChange.bind(this)} name={'username'}
                                   error={this.state.username === '' && this.state.submit === true} margin={'normal'}/>

                        <TextField required id={"password"} className={'input halfLength'} type={'password'}
                                   label={'Password'} variant={'outlined'}
                                   value={this.state.password} onChange={this.handleOnChange.bind(this)}
                                   name={'password'}
                                   error={this.state.password === '' && this.state.submit === true} margin={'normal'}/>
                        <br/>
                        <TextField required id={"firstName"} className={'input halfLength'} type={'text'}
                                   label={'First Name'} variant={'outlined'}
                                   value={this.state.firstname} onChange={this.handleOnChange.bind(this)}
                                   name={'firstname'}
                                   error={this.state.firstname === '' && this.state.submit === true} margin={'normal'}/>

                        <TextField required id={"surname"} className={'input halfLength'} type={'text'}
                                   label={'Last Name'} variant={'outlined'}
                                   value={this.state.surname} onChange={this.handleOnChange.bind(this)} name={'surname'}
                                   error={this.state.surname === '' && this.state.submit === true} margin={'normal'}/>
                        <br/>
                        <TextField required id={"email"} className={'input fullLength'} type={'email'}
                                   label={'Email Address'} variant={'outlined'}
                                   value={this.state.email} onChange={this.handleOnChange.bind(this)} name={'email'}
                                   error={!sharedMethods.validateEmail(this.state.email) && this.state.submit === true}
                                   margin={'normal'}/>
                        <br/>
                        <TextField required id={"phone"} className={'input fullLength'} type={'phone'}
                                   label={'Phone Number'} variant={'outlined'}
                                   value={this.state.phone} onChange={this.handleOnChange.bind(this)} name={'phone'}
                                   error={!sharedMethods.validatePhone(this.state.phone) && this.state.submit === true}
                                   margin={'normal'}/>
                        <br/>
                        <Button type={'submit'} variant={'contained'} color={'primary'} size={'large'}
                                id={'submitRegister'}>Register</Button>
                    </form>
                </div>
            </div>
        );
    }

    submitForm(event) {
        event.preventDefault();
        this.setFormStateSubmitted()

        let {username, password, firstname, surname, email, phone} = this.state;
        password = this.hashPassword(password);

        if (this.validateFieldsNotEmpty(username, this.state.password, firstname, surname, email, phone)) {
            const data = {
                username: username,
                password: password,
                firstname: firstname,
                surname: surname,
                phonenumber: phone,
                mail: email
            }
            ApiService.post('/register', data)
                .then((result) => result.json())
                .then(
                    (result) => {
                        if (result.worked === false) {
                            this.giveUserFeedback(this.somethingWentWrongMessage, false)
                        } else {
                            this.handleCorrectRegister()
                        }
                    },
                    (error) => {
                        this.handleError(error)
                    }
                );
        }
    }

    hashPassword(password) {
        return sha256(password);
    }

    handleOnChange(e) {
        const {target: {value, name}} = e;
        this.setState({
            [name]: value
        });
    }

    handleOpen() {
        this.props.toggleModal('showRegister')
    }

    logUserIn() {
        authenticationService.login(this.state.username, this.hashPassword(this.state.password));
    }

    setStateToInitial() {
        this.setState({
            username: '',
            password: '',
            firstname: '',
            surname: '',
            email: '',
            phone: '',
            submit: false,
        })
    }

    setFormStateSubmitted() {
        this.setState({submit: true})
    }

    validateFieldsNotEmpty(username, password, firstname, surname, email, phone) {
        return (username !== '' && password !== '' && firstname !== '' && surname !== '' && sharedMethods.validatePhone(phone) && sharedMethods.validateEmail(email));
    }

    handleError(error) {
        console.error(error)
        this.giveUserFeedback(this.somethingWentWrongMessage, false)
    }



    giveUserFeedback(feedback, success) {
        if (success) {
            ToastMaker.successToast(feedback)
        } else {
            ToastMaker.errorToast(feedback)
        }
    }

    handleCorrectRegister() {
        this.giveUserFeedback('Register successfully', true)
        this.handleOpen()
        this.logUserIn();
        this.setStateToInitial();
    }
}

Register.propTypes = {
    toggleModal: PropTypes.func,
};
