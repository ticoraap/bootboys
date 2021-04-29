import React, { Component } from "react";
import classes from "./Login.module.css";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";

export class Login extends Component {
    state = {
        email: { value: "", valid: false },
        password: { value: "", valid: false },
        isFormValid: false,
    };

    onSubmit = (event) => {
        event.preventDefault();
        this.props.onLogin(this.state.email.value, this.state.password.value);
    };

    onInputChange = (id, value, valid) => {
        this.setState({
            [id]: { value, valid },
        });
        this.setFormValidityToState();
    };

    setFormValidityToState = () => {
        this.setState((prevState) => {
            return {
                isFormValid: prevState.email.valid && prevState.password.valid,
            };
        });
    };

    render() {
        return (
            <form>
                <div className={classes.LoginHeader}>
                    <span
                        className={classes.CloseModal}
                        onClick={this.props.LoginModalToggle}
                    >
                        &times;
                    </span>
                    <h1>Login</h1>
                    <hr />
                </div>
                <div>
                    <Input
                        id="email"
                        type="text"
                        value={this.state.email.value}
                        label="E-mail"
                        placeholder="Enter your e-mail"
                        validationRules={{
                            isEmail: true,
                        }}
                        notifyParentOfChange={this.onInputChange}
                    />
                    <Input
                        id="password"
                        type="password"
                        value={this.state.password.value}
                        label="Password"
                        placeholder="Enter your e-mail"
                        validationRules={{
                            minLength: 8,
                        }}
                        notifyParentOfChange={this.onInputChange}
                    />

                    <Button
                        btnType="Form"
                        disabled={!this.state.isFormValid}
                        clicked={this.onSubmit}
                    >
                        Login
                    </Button>
                </div>
            </form>
        );
    }
}

Login.propTypes = {
    LoginModalToggle: PropTypes.func,
    onLogin: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (email, password) => dispatch(actions.auth(email, password)),
    };
};

export default connect(null, mapDispatchToProps)(Login);
