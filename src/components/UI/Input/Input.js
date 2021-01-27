import React from "react";
import classes from "./Input.module.css";
import PropTypes from "prop-types";

const input = (props) => {
    let inputElement = null;
    const inputClasses = [classes.InputElement];

    if (props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid);
    }

    let validationError = null;
    if (props.invalid && props.touched) {
        validationError = (
            <p className={classes.ValidationError}>
                {props.validationWarning
                    ? props.validationWarning
                    : "*Please enter a valid value"}
            </p>
        );
    }

    switch (props.elementType) {
        case "input":
            inputElement = (
                <input
                    className={inputClasses.join(" ")}
                    {...props.elementConfig}
                    value={props.value}
                    onChange={props.changed}
                />
            );
            break;
        case "textArea":
            inputElement = (
                <textarea
                    className={inputClasses.join(" ")}
                    {...props.elementConfig}
                    value={props.value}
                    onChange={props.changed}
                />
            );
            break;
        case "passChildElement":
            inputElement = props.children;
            break;
        case "select":
            inputElement = (
                <select
                    className={inputClasses.join(" ")}
                    value={props.value}
                    onChange={props.changed}
                    disabled={
                        !props.elementConfig.options.length ||
                        props.elementConfig.disabled
                    }
                >
                    {props.elementConfig.options.length ? (
                        <option value="" defaultValue>
                            {props.elementConfig.placeholder}
                        </option>
                    ) : (
                        <option defaultValue key="" value="">
                            {props.elementConfig.emptyPlaceholder}
                        </option>
                    )}
                    {props.elementConfig.options.map((option) => {
                        return (
                            <option key={option.value} value={option.value}>
                                {option.displayValue}
                            </option>
                        );
                    })}
                </select>
            );
            break;
        default:
            inputElement = (
                <input
                    className={inputClasses.join(" ")}
                    {...props.elementConfig}
                    value={props.value}
                    onChange={props.changed}
                />
            );
    }

    let wrapperClassNames = [classes.Input];

    if (props.wrapperClassName) {
        wrapperClassNames.push(classes[props.wrapperClassName]);
    }

    return (
        <div className={wrapperClassNames.join(" ")} style={props.styling}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
            {validationError}
        </div>
    );
};

input.propTypes = {
    invalid: PropTypes.bool,
    shouldValidate: PropTypes.object,
    touched: PropTypes.bool,
    validationWarning: PropTypes.string,
    elementType: PropTypes.string,
    elementConfig: PropTypes.any,
    value: PropTypes.any,
    changed: PropTypes.any,
    label: PropTypes.string,
    styling: PropTypes.object,
    disabled: PropTypes.bool,
    children: PropTypes.any,
    wrapperClassName: PropTypes.string,
};

export default input;
