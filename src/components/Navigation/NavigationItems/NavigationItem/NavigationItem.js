import React from 'react';
import PropTypes from 'prop-types';

import classes from './NavigationItem.module.css';
import {NavLink} from 'react-router-dom';

const sideDrawerNavigationItem = (props) => (

    <li className={classes.NavigationItem}>
        <NavLink
            onClick={props.closeSidedrawer}
            exact={props.exact}
            activeClassName={classes.active}
            to={props.link}>
            {props.children}
        </NavLink>
    </li>
)

sideDrawerNavigationItem.propTypes = {
    exact: PropTypes.bool,
    link: PropTypes.string,
    children: PropTypes.any,
    click: PropTypes.func,
    closeSidedrawer: PropTypes.func,
};

export default sideDrawerNavigationItem;
