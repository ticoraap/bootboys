import React, { Component } from 'react';
import classes from './NavigationItems.module.css';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";

import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import * as actionTypes from '../../../store/actions/actionTypes';

import NavigationItem from './NavigationItem/NavigationItem';
import { authenticationService } from '../../../components/LoginComponent/authentication.service'

export class NavigationItems extends Component {


    loginLogout = () => {
        if (this.props.NavigationType === 'SideDrawer'){
            this.newToggleSideDrawer()
        }
        if(this.props.isAuthenticated){
            authenticationService.logout()
            this.props.onLogoutUser(this.props.history)
        } else {
            this.props.onToggleLoginModal()
        }
    }
    
    register = () => {
        if (this.props.NavigationType === 'SideDrawer'){
            this.newToggleSideDrawer()
        }
        this.props.onToggleRegisterModal()
    }
    
    newToggleSideDrawer = () => {
        if (this.props.NavigationType === 'SideDrawer'){
            this.props.onToggleSideDrawer()
        }
    }
    
    showAccount = () => {
        return <NavigationItem closeSidedrawer={this.newToggleSideDrawer} link="/Account" exact>Account</NavigationItem>
    }

    showRegister = () => {
        return <span className={classes.NavigationItem} onClick={this.register}><p>Register</p></span>
    }

    render(){
        return (
            <ul className={classes.NavigationItem}>
                
                <NavigationItem closeSidedrawer={this.newToggleSideDrawer} link="/" exact>Home</NavigationItem>
                {this.props.isAuthenticated ? <NavigationItem closeSidedrawer={this.newToggleSideDrawer} link="/manage-docks" exact>Manage Docks</NavigationItem> : null }
                <NavigationItem closeSidedrawer={this.newToggleSideDrawer} link="/rent-dock" exact>Rent Dock</NavigationItem>
                {this.props.isAuthenticated ? this.showAccount() : this.showRegister() }
                <span className={classes.NavigationItem} onClick={this.loginLogout}><p>{this.props.isAuthenticated ? 'Logout' : 'Login'}</p></span>
            </ul>
        )
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

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        showSideDrawer: state.ux.showSideDrawer,
        showLoginModal: state.ux.showLoginModal,
        showRegisterModal: state.ux.showRegisterModal,
        showForgotpasswordModal: state.ux.showForgotpasswordModal,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onToggleSideDrawer: () => dispatch({type: actionTypes.TOGGLE_SIDEDRAWER}),
        onLogoutUser: (history) => dispatch(actions.logoutUser(history)),
        onToggleLoginModal: () => dispatch({type: actionTypes.TOGGLE_LOGIN_MODAL}),
        onToggleRegisterModal: () => dispatch({type: actionTypes.TOGGLE_REGISTER_MODAL}),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(NavigationItems));

