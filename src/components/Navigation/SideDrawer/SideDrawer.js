import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import * as actionTypes from "../../../store/actions/actionTypes";

import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import classes from "./SideDrawer.module.css";
import Backdrop from "../../UI/Backdrop/Backdrop";

const sideDrawer = (props) => {
    let attachedClasses = [classes.SideDrawer, classes.Close];
    if (props.showSideDrawer) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }

    return (
        <>
            <Backdrop
                show={props.showSideDrawer}
                clicked={props.onToggleSideDrawer}
            />
            <div className={attachedClasses.join(" ")}>
                <div className={classes.Logo}>
                    <Logo />
                </div>
                <nav>
                    <NavigationItems isSideDrawer />
                </nav>
            </div>
        </>
    );
};

sideDrawer.propTypes = {
    onToggleSideDrawer: PropTypes.func,
    showSideDrawer: PropTypes.bool,
};

const mapStateToProps = (state) => {
    return {
        showSideDrawer: state.ux.showSideDrawer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onToggleSideDrawer: () =>
            dispatch({ type: actionTypes.TOGGLE_SIDEDRAWER }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(sideDrawer);
