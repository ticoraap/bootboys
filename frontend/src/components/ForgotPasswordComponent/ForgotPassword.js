import React, {Component} from "react";
import './ForgotPassword.css'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {ApiService} from "../shared/Api.service";
import PropTypes from 'prop-types';
import ToastMaker from "../shared/ToastMaker";

export default class ForgotPassword extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
        }
    }

    render() {
        return (
            <div id={'modalForgotPass'}>
                <span className={'closeModal'}
                      onClick={() => this.props.toggleModal('showForgotPassword')}>&times;</span>
                <h1>Forgot Password</h1>
                <hr/>
                <form autoComplete="off" onSubmit={this.submitHandler.bind(this)}>
                    <TextField required className={'fullLength'} id={'emailInput'} type={'email'} label={'Email'}
                               variant={'outlined'}
                               value={this.state.email} onChange={this.handleOnChange.bind(this)} name={'email'}
                               margin={'normal'}/>
                    <br/>
                    <Button type={'submit'} variant={'contained'} color={'primary'} size={'large'} id={'submitForgot'}>Request
                        new password</Button>
                </form>
            </div>
        )
    }

    submitHandler(event) {
        event.preventDefault()
        const data = {email: this.state.email}
        ApiService.post('/requestnewpass', data)
            .then(response => response.json()).then(
            () => {
                this.confirmNewPasswordSent()
                this.props.toggleModal('showForgotPassword')
                this.openLogin()

            },
            () => {
                this.confirmNewPasswordSent()
                this.props.toggleModal('showForgotPassword')
                this.openLogin()
            }
        )
    }


    handleOnChange(e) {
        const {target: {value, name}} = e;
        this.setState({
            [name]: value
        });
    }

    closeModal() {
        this.props.toggleModal('showForgotPassword')
    }

    confirmNewPasswordSent() {
        this.setState({
            email: ''
        })
        ToastMaker.successToast('New password has been sent!')
    }

    openLogin() {
        this.props.toggleModal('showLogin')
    }
}

ForgotPassword.propTypes = {
    toggleModal: PropTypes.func,
};
