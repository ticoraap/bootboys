import React from "react";
import classes from "./Input.module.css";
import PropTypes from "prop-types";

const input = ({
    wrapperClassName,
    elementType,
    elementConfig,
    value,
    valid,
    validationRules,
    touched,
    label,
    validationWarning,
    styling,
    changed,
    ...props
}) => {
    let inputElement = null;
    const inputClasses = [classes.InputElement];

    if (!valid && validationRules && touched) {
        inputClasses.push(classes.Invalid);
    }

    let validationError = null;
    if (!valid && touched) {
        validationError = (
            <p className={classes.ValidationError}>
                {validationWarning
                    ? validationWarning
                    : "*Please enter a valid value"}
            </p>
        );
    }

    switch (elementType) {
        case "input":
            inputElement = (
                <input
                    className={inputClasses.join(" ")}
                    {...elementConfig}
                    value={value}
                    onChange={changed}
                />
            );
            break;
        case "textArea":
            inputElement = (
                <textarea
                    className={inputClasses.join(" ")}
                    {...elementConfig}
                    value={value}
                    onChange={changed}
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
                    value={value}
                    onChange={changed}
                    disabled={
                        !elementConfig.options.length ||
                        elementConfig.disabled
                    }
                >
                    {elementConfig.options.length ? (
                        <option value="" defaultValue>
                            {elementConfig.placeholder}
                        </option>
                    ) : (
                        <option defaultValue key="" value="">
                            {elementConfig.emptyPlaceholder}
                        </option>
                    )}
                    {elementConfig.options.map((option) => {
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
                    {...elementConfig}
                    value={value}
                    onChange={changed}
                />
            );
    }

    let wrapperClassNames = [classes.Input];

    if (wrapperClassName) {
        wrapperClassNames.push(classes[wrapperClassName]);
    }

    return (
        <div className={wrapperClassNames.join(" ")} style={styling}>
            <label className={classes.Label}>{label}</label>
            {inputElement}
            {validationError}
        </div>
    );
};

input.propTypes = {
    valid: PropTypes.bool,
    validationRules: PropTypes.object,
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
