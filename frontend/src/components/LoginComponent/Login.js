import React, {Component} from "react";
import './Login.css'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {sha256} from "js-sha256";
import {authenticationService} from "./authentication.service";
import PropTypes from 'prop-types';
import ToastMaker from "../shared/ToastMaker";
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';


export class Login extends Component {
 
    state = {
        username: '',
        password: '',
    }
    
    render() {

        return (
            <div id={'modalLogin'}>
                <span id={'closeLogin'} className={'closeModal'} onClick={this.props.LoginModalToggle}>&times;</span>
                <h1>Login</h1>
                <hr/>
                <form autoComplete="off" onSubmit={this.submitHandler}>
                    <TextField required id={'loginUsername'} type={'text'} label={'Username'} variant={'outlined'}
                               autoFocus={true} value={this.state.username} onChange={this.handleOnChange.bind(this)}
                               name={'username'} margin={'normal'}/>
                    <br/>
                    <TextField required id={'loginPassword'} type={'password'} label={'Password'} variant={'outlined'}
                               value={this.state.password} onChange={this.handleOnChange.bind(this)} name={'password'}
                               margin={'normal'}/>
                    <br/>
                    <Button type={'submit'} variant={'contained'} color={'primary'} size={'large'}
                            id={'submitLogin'}>Login</Button>
                </form>
                <span id={'forgotPassword'} onClick={this.openForgotPassword.bind(this)}>Forgot password?</span>
            </div>
        )
    }

    openForgotPassword() {
        this.props.LoginModalToggle()
        this.props.ForgotPasswordModalToggle()
    }

    submitHandler = (event) => {
        event.preventDefault()
        let {username, password} = this.state
        password = sha256(password)
        authenticationService.login(username, password)
            .then(() => {
                this.props.LoginModalToggle()
                this.setState({
                    username: '',
                    password: ''
                })
                this.props.onLoginUser()
                ToastMaker.successToast("login Succesfull!")
            })
            .catch(() => {
                ToastMaker.errorToast("login failed")
            })
    }

    handleOnChange(e) {
        const {target: {value, name}} = e;
        this.setState({
            [name]: value
        });
    }
}

Login.propTypes = {
    LoginModalToggle: PropTypes.func,
    ForgotPasswordModalToggle: PropTypes.func,
    onLoginUser: PropTypes.func,
};



const mapDispatchToProps = dispatch => {
    return {
        onLoginUser: () => dispatch(actions.loginUser()),
    }
}

export default connect(null,mapDispatchToProps)(Login);