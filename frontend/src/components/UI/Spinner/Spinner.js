import React from 'react';
import classes from './Spinner.module.css';
import PropTypes from 'prop-types';

const spinner = (props) => (
    <div className={classes.Loader}>{props.message ? props.message : "Loading..."}</div>
)

spinner.propTypes = {
    message: PropTypes.string
};

export default spinner;
