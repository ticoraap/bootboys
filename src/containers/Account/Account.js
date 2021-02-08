import React, { Component } from "react";
import "./Account.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import TextField from "@material-ui/core/TextField";

class Account extends Component {
    state = {
        editDetails: false,
        password: "",
    };

    componentDidMount() {
        this.setState({ name: this.props.name });
    }

    onClickEditButton() {
        this.setState({ editDetails: true });
    }

    onInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    submitForm = (event) => {
        event.preventDefault();
        this.props.onChangePassword(this.state.password, this.props.token);
    };

    render() {
        if (this.state.editDetails) {
            return (
                <div>
                    <div id="elementbox">
                        <h1>Account Details</h1>
                        <div id="editform">
                            <form
                                noValidate
                                autoComplete="off"
                                onSubmit={this.submitForm}
                            >
                                <TextField
                                    id="Password"
                                    label="New Password"
                                    defaultValue={this.state.password}
                                    variant={"outlined"}
                                    name="password"
                                    type="password"
                                    onChange={this.onInputChange}
                                    margin={"normal"}
                                />
                                <button type={"submit"} id="editbutton">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div id="master">
                <div id="elementbox">
                    <h1>Account Details</h1>
                    <div id="textfields">
                        <p id="ownP">
                            Username: {this.props.name} <br />
                            Email: {this.props.email} <br />
                        </p>
                    </div>
                    <button
                        id="editbutton"
                        onClick={this.onClickEditButton.bind(this)}
                    >
                        Edit Details
                    </button>
                </div>
            </div>
        );
    }
}

Account.propTypes = {
    name: PropTypes.string,
    email: PropTypes.string,
    onChangePassword: PropTypes.func,
};

const mapStateToProps = (state) => {
    return {
        name: state.auth.name,
        email: state.auth.email,
        token: state.auth.token,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onChangePassword: (password, token) =>
            dispatch(actions.changePassword(password, token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);