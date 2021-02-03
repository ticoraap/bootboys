import React, { Component } from "react";
import classes from "./NavigationItems.module.css";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import * as actionTypes from "../../../store/actions/actionTypes";

import NavigationItem from "./NavigationItem/NavigationItem";
import { authenticationService } from "../../Login/authentication.service";

export class NavigationItems extends Component {
    onLoginLogout = () => {
        if (this.props.NavigationType === "SideDrawer") {
            this.toggleSideDrawerIfMobileLayout();
        }
        if (this.props.isAuthenticated) {
            authenticationService.logout();
            this.props.onLogoutUser(this.props.history);
        } else {
            this.props.onToggleLoginModal();
        }
    };

    onRegister = () => {
        if (this.props.NavigationType === "SideDrawer") {
            this.toggleSideDrawerIfMobileLayout();
        }
        this.props.onToggleRegisterModal();
    };

    toggleSideDrawerIfMobileLayout = () => {
        if (this.props.NavigationType === "SideDrawer") {
            this.props.onToggleSideDrawer();
        }
    };

    render() {
        return (
            <ul className={classes.NavigationItem}>
                <NavigationItem
                    closeSidedrawer={this.toggleSideDrawerIfMobileLayout}
                    link="/rent-dock"
                    exact
                >
                    Rent Dock
                </NavigationItem>
                {this.props.isAuthenticated ? (
                    <NavigationItem
                        closeSidedrawer={this.toggleSideDrawerIfMobileLayout}
                        link="/manage-docks"
                        exact
                    >
                        Manage Docks
                    </NavigationItem>
                ) : null}

                {this.props.isAuthenticated ? (
                    <NavigationItem
                        closeSidedrawer={this.toggleSideDrawerIfMobileLayout}
                        link="/Account"
                        exact
                    >
                        Account
                    </NavigationItem>
                ) : null}
                {!this.props.isAuthenticated ? (
                    <span
                        className={classes.NavigationItem}
                        onClick={this.onRegister}
                    >
                        <p>Register</p>
                    </span>
                ) : null}
                <span
                    className={classes.NavigationItem}
                    onClick={this.onLoginLogout}
                >
                    <p>{this.props.isAuthenticated ? "Logout" : "Login"}</p>
                </span>
            </ul>
        );
    }
}

NavigationItems.propTypes = {
    isAuthenticated: PropTypes.bool,
    NavigationType: PropTypes.string,
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
