import React, { Component } from "react";
import classes from "./Register.module.css";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";

class Register extends Component {
    state = {
        email: { value: "", valid: false },
        password: { value: "", valid: false },
        allValid: false,
    };

    omSubmit = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.email.value, this.state.password.value);
    };

    inputChangedHandler = (id, value, valid) => {
        this.setState({
            [id]: { value: value, valid: valid },
        });
        this.setState((prevState) => {
            return {
                allValid: prevState.email.valid && prevState.password.valid,
            };
        });
    };

    render() {
        return (
            <form>
                <div className={classes.RegisterHeader}>
                    <span
                        className={classes.CloseModal}
                        onClick={this.props.registerModalToggle}
                    >
                        &times;
                    </span>
                    <h1>Sign up</h1>
                    <hr />
                </div>
                <div>
                    <Input
                        id="email"
                        type="text"
                        value={this.state.email.value}
                        label="E-mail"
                        placeholder="Enter your e-mail"
                        invalidMessage="Please enter a valid email"
                        validationRules={{
                            isEmail: true,
                        }}
                        notifyParentOfChange={this.inputChangedHandler}
                        />
                    <Input
                        id="password"
                        type="password"
                        value={this.state.password.value}
                        label="Password"
                        placeholder="Enter your e-mail"
                        invalidMessage="Minimum of 8 characters required"
                        validationRules={{
                            minLength: 8,
                        }}
                        notifyParentOfChange={this.inputChangedHandler}
                    />

                    <Button
                        btnType="Form"
                        disabled={!this.state.allValid}
                        clicked={this.onSubmit}
                    >
                        Login
                    </Button>
                </div>
            </form>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        onRegister: (username, password) =>
            dispatch(actions.createAccount(username, password)),
    };
};

export default connect(null, mapDispatchToProps)(Register);

Register.propTypes = {
    toggleModal: PropTypes.func,
    onRegister: PropTypes.func,
};
