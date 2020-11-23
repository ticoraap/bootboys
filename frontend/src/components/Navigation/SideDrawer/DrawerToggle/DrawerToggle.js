import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import classes from './DrawerToggle.module.css';
import * as actionTypes from '../../../../store/actions/actionTypes';

const drawerToggle = (props) => (
    <div className={classes.DrawerToggle} onClick={props.onToggleSideDrawer}>
        <div></div>
        <div></div>
        <div></div>
    </div>
)

drawerToggle.propTypes = {
    onToggleSideDrawer: PropTypes.func
};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        showSideDrawer: state.ux.showSideDrawer
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onToggleSideDrawer: () => dispatch({type: actionTypes.TOGGLE_SIDEDRAWER}),
        onLoginUser: (username,password) => dispatch({type: actionTypes.LOGIN_USER, username: username, password: password}),
        onLogoutUser: () => dispatch({type: actionTypes.LOGOUT_USER})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(drawerToggle);
