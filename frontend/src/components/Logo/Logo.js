import React from 'react';

import classes from './Logo.module.css';
import boatLogo from '../../assets/images/boatLogo.png';
import PropTypes from "prop-types";

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={boatLogo} alt="BootBoys"/>
    </div>
)

logo.propTypes = {
    height: PropTypes.string
};

export default logo;
