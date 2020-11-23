import React from 'react';

import Button from '../../../components/UI/Button/Button';
import classes from './Facility.module.css';
import PropTypes from 'prop-types';

const facility = (props) => (
    <div className={classes.Facility}>
        <div>
            <p>€{props.price.toFixed(2).replace('.', ',')}</p>
            <p>{props.description}</p>
        </div>
        <Button btnType="Facility" clicked={props.deleteFacility}>X</Button>
    </div>
)

facility.propTypes = {
    price: PropTypes.number,
    description: PropTypes.string,
    deleteFacility: PropTypes.func
};

export default facility;
