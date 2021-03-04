import React, { Component } from "react";
import classes from "./Login.module.css";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

import Input from "../UI/InputCom/InputCom";
import Button from "../UI/Button/Button";
import Auxiliary from "../../HOC/Auxiliary/Auxiliary";

export class Login extends Component {
    state = {
        email: { value: "", valid: false },
        password: { value: "", valid: false },
        allValid: false,
    };

    onSubmit = () => {
        this.props.onLogin(this.state.email.value, this.state.password.value); 
    };

    onInputChange = (id, value, valid) => {
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
            <Auxiliary>
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
                        disabled={!this.state.allValid}
                        clicked={this.onSubmit}
                    >
                        Login
                    </Button>
                </div>
            </Auxiliary>
        );
    }
}

Login.propTypes = {
    LoginModalToggle: PropTypes.func,
    onAuth: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (email, password) => dispatch(actions.auth(email, password)),
    };
};

export default connect(null, mapDispatchToProps)(Login);
