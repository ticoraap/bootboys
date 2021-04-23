import React, { Component } from "react";
import classes from "./NavigationItems.module.css";

import PropTypes from "prop-types";
import { withRouter } from "react-router";

import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import * as actionTypes from "../../../store/actions/actionTypes";

import NavigationItem from "./NavigationItem/NavigationItem";
import Auxiliary from "../../../HOC/Auxiliary/Auxiliary";

export class NavigationItems extends Component {
    onLogin = () => {
        this.props.onToggleLoginModal();
        this.toggleSideDrawer();
    };

    onRegister = () => {
        this.props.onToggleRegisterModal();
        this.toggleSideDrawer();
    };

    toggleSideDrawer = () => {
        if (this.props.isSideDrawer) {
            this.props.onToggleSideDrawer();
        }
    };

    render() {
        return (
            <ul className={classes.NavigationItems}>
                <NavigationItem
                    onClick={this.toggleSideDrawer}
                    link="/rent-dock"
                    exact
                >
                    Rent Dock
                </NavigationItem>

                {this.props.isAuthenticated ? (
                    <Auxiliary>
                        <NavigationItem
                            onClick={this.toggleSideDrawer}
                            link="/manage-docks"
                            exact
                        >
                            Manage Docks
                        </NavigationItem>
                        <NavigationItem
                            onClick={this.toggleSideDrawer}
                            link="/account"
                            exact
                        >
                            Account
                        </NavigationItem>

                        <NavigationItem
                            onClick={() =>
                                this.props.onLogoutUser(this.props.history)
                            }
                        >
                            Logout
                        </NavigationItem>
                    </Auxiliary>
                ) : (
                    <Auxiliary>
                        <NavigationItem onClick={this.onRegister}>
                            Register
                        </NavigationItem>

                        <NavigationItem onClick={this.onLogin}>
                            Login
                        </NavigationItem>
                    </Auxiliary>
                )}
            </ul>
        );
    }
}

NavigationItems.propTypes = {
    isAuthenticated: PropTypes.bool,
    isSideDrawer: PropTypes.bool,
    onLogoutUser: PropTypes.func,
    onToggleSideDrawer: PropTypes.func,
    onToggleLoginModal: PropTypes.func,
    onToggleRegisterModal: PropTypes.func,
    history: PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.token !== null,
        showSideDrawer: state.ux.showSideDrawer,
        showLoginModal: state.ux.showLoginModal,
        showRegisterModal: state.ux.showRegisterModal,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onToggleSideDrawer: () =>
            dispatch({ type: actionTypes.TOGGLE_SIDEDRAWER }),
        onLogoutUser: (history) => dispatch(actions.logoutUser(history)),
        onToggleLoginModal: () =>
            dispatch({ type: actionTypes.TOGGLE_LOGIN_MODAL }),
        onToggleRegisterModal: () =>
            dispatch({ type: actionTypes.TOGGLE_REGISTER_MODAL }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(NavigationItems));
