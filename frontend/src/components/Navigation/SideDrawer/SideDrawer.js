import React from 'react';
import { connect } from 'react-redux';

import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.module.css';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Auxiliary from '../../../HOC/Auxiliary/Auxiliary';
import PropTypes from 'prop-types';
import * as actionTypes from '../../../store/actions/actionTypes';

const sideDrawer = (props) => {

    let attachedClasses = [classes.SideDrawer, classes.Close]
    if (props.showSideDrawer) {
        attachedClasses = [classes.SideDrawer, classes.Open]
    }

    return (
        <Auxiliary>
            <Backdrop show={props.showSideDrawer} clicked={props.onToggleSideDrawer}/>
            <div className={attachedClasses.join(' ')}>
                <div className={classes.Logo}>
                    <Logo/>
                </div>
                <nav>
                    <NavigationItems NavigationType='SideDrawer'/>
                </nav>
            </div>
        </Auxiliary>
    )
}

sideDrawer.propTypes = {
    onToggleSideDrawer: PropTypes.func,
    showSideDrawer: PropTypes.bool,
};

const mapStateToProps = state => {
    return {
        showSideDrawer: state.ux.showSideDrawer,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onToggleSideDrawer: () => dispatch({type: actionTypes.TOGGLE_SIDEDRAWER})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(sideDrawer);
