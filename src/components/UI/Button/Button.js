import React from "react";
import classes from "./Button.module.css";
import PropTypes from "prop-types";

const button = (props) => {
    const buttonClasses = [classes.Button, classes[props.btnType]];
    if (props.disabled) {
        buttonClasses.push(classes.Disabled);
    }
    return (
        <button
            disabled={props.disabled}
            onClick={props.clicked}
            className={buttonClasses.join(" ")}
        >
            {props.children}
        </button>
    );
};

button.propTypes = {
    btnType: PropTypes.string,
    disabled: PropTypes.bool,
    clicked: PropTypes.func,
    children: PropTypes.any,
};

export default button;
