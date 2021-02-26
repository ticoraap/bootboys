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

    submitHandler = () => {
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
                        label="E-mail"
                        placeholder="Enter your e-mail"
                        validationRules={{
                            isEmail: true,
                        }}
                        notifyParentOfChange={this.inputChangedHandler}
                    />
                    <Input
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="Enter your e-mail"
                        validationRules={{
                            minLength: 8,
                        }}
                        notifyParentOfChange={this.inputChangedHandler}
                    />

                    <Button
                        btnType="Form"
                        disabled={!this.state.allValid}
                        clicked={this.submitHandler}
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
        onAuth: (email, password) => dispatch(actions.auth(email, password)),
    };
};

export default connect(null, mapDispatchToProps)(Login);
