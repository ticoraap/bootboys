import React, { useState } from "react";
import classes from "./Input.module.css";
import { isInputValidByRules } from "../../../shared/validation";

const Input = ({
    id,
    type,
    label,
    placeholder,
    value = "",
    validationRules,
    invalidMessage,
    notifyParentOfChange,
    disabled = false,
    className,
    ...props
}) => {
    const [touched, setTouched] = useState(false);
    const [valid, setValid] = useState(true);

    function inputChanged(event) {
        setTouched(true);
        const isValid = isInputValidByRules(
            event.target.value,
            validationRules
        );
        setValid(isValid);
        notifyParentOfChange(id, event.target.value, isValid);
    }

    let inputElement = null;
    const inputClasses = [classes.InputElement];

    if (!valid && touched) {
        inputClasses.push(classes.Invalid);
    }

    if (disabled) {
        inputClasses.push(classes.Disabled);
    }

    switch (type) {
        case "input":
            inputElement = (
                <input
                    className={inputClasses.join(" ")}
                    value={value}
                    onChange={inputChanged}
                    disabled={disabled}
                    placeholder={placeholder}
                />
            );
            break;
        case "password":
            inputElement = (
                <input
                    type="password"
                    className={inputClasses.join(" ")}
                    value={value}
                    onChange={inputChanged}
                    disabled={disabled}
                    placeholder={placeholder}
                />
            );
            break;
        case "textArea":
            inputElement = (
                <textarea
                    className={inputClasses.join(" ")}
                    value={value}
                    onChange={inputChanged}
                    disabled={disabled}
                    placeholder={placeholder}
                />
            );
            break;

        default:
            inputElement = (
                <input
                    className={inputClasses.join(" ")}
                    value={value}
                    onChange={inputChanged}
                    disabled={disabled}
                    placeholder={placeholder}
                />
            );
    }

    let validationWarning = null;
    if (!valid && touched) {
        validationWarning = (
            <p className={classes.validationWarning}>
                {invalidMessage
                    ? invalidMessage
                    : "*Please enter a valid value"}
            </p>
        );
    }

    return (
        <div className={className}>
            <label className={classes.Label}>{label}</label>
            {inputElement}
            {validationWarning}
        </div>
    );
};

export default Input;
