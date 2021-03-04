import React from 'react';

import classes from './Logo.module.css';
import boatLogo from '../../assets/images/boatLogo.png';
import PropTypes from "prop-types";

// TODO: remove style property and use css for styling

const logo = (props) => (
    <div className={classes.Logo} >
        <img src={boatLogo} alt="BootBoys"/>
    </div>
)

logo.propTypes = {
    height: PropTypes.string
};

export default logo;
