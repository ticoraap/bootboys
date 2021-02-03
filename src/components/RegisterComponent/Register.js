import React, {Component} from "react";

import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

import './Register.css';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PropTypes from 'prop-types';
import sharedMethods from "../shared/SharedMethods";
// import ToastMaker from "../shared/ToastMaker";

class Register extends Component {
    state = {
        email: '',
        password: '',
        submit: false,
    }

    submitForm(event) {
        event.preventDefault()
        this.props.onRegister(this.state.email, this.state.password)
    }

    handleOnChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleOpen() {
        this.props.toggleModal('showRegister')
    }

    render() {
        return (
            <div className={'noRemove'}>
                <div id={'modalSignUp'} className={'noRemove'} ref={node => {
                    this.pop = node
                }}>
                    <span className={'closeModal'} onClick={() => this.props.toggleModal('showRegister')}>&times;</span>
                    <h1>Sign up</h1>
                    <hr/>
                    <form  noValidate autoComplete="off" onSubmit={this.submitForm.bind(this)}>
                        
                        <TextField required id={"email"} className={'input fullLength'} type={'email'}
                                   label={'Email Address'} variant={'outlined'}
                                   value={this.state.email} onChange={this.handleOnChange.bind(this)} name={'email'}
                                   error={!sharedMethods.validateEmail(this.state.email) && this.state.submit === true}
                                   margin={'normal'}/>

                    
                        <TextField required id={"password"} className={'input fullLength'} type={'password'}
                                   label={'Password'} variant={'outlined'}
                                   value={this.state.password} onChange={this.handleOnChange.bind(this)}
                                   name={'password'}
                                   error={this.state.password === '' && this.state.submit === true} margin={'normal'}/>
          
                        <br/>
                        <Button type={'submit'} variant={'contained'} color={'primary'} size={'large'}
                                id={'submitRegister'}>Register</Button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userDocks: state.dock.userDocks,
        
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRegister: (username, password) => dispatch(actions.createAccount(username, password)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register)

Register.propTypes = {
    toggleModal: PropTypes.func,
    onRegister: PropTypes.func
};
