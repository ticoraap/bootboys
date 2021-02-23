import React from "react";
import PropTypes from "prop-types";

import classes from "./NavigationItem.module.css";
import { NavLink } from "react-router-dom";

const sideDrawerNavigationItem = (props) => {
    if (!props.link) {
        return (
            <li className={classes.NavigationItem} onClick={props.onClick}>
                <p>{props.children}</p>
            </li>
        );
    }

    return (
        <li className={classes.NavigationItem}>
            <NavLink
                onClick={props.onClick}
                exact={props.exact}
                activeClassName={classes.active}
                to={props.link}
            >
                {props.children}
            </NavLink>
        </li>
    );
};

sideDrawerNavigationItem.propTypes = {
    exact: PropTypes.bool,
    link: PropTypes.string,
    children: PropTypes.any,
    onClick: PropTypes.func,
};

export default sideDrawerNavigationItem;
