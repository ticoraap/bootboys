import React, { useState } from "react";
import classes from "./InputCom.module.css";
import { isInputValidByRules } from "../../../shared/validation";

const InputCom = ({
    id,
    type,
    label,
    placeholder,
    value = "",
    validationRules,
    invalidMessage,
    notifyParentOfChange,
    ...props
}) => {
    const [inputValue, setInputValue] = useState(value);
    const [touched, setTouched] = useState(false);
    const [valid, setValid] = useState(true);

    function inputChanged(event) {
        setTouched(true);
        setInputValue(event.target.value);
        const isValid = isInputValidByRules(event.target.value, validationRules)
        setValid(isValid);
        notifyParentOfChange(id, event.target.value, isValid)
    }

    let inputElement = null;
    const inputClasses = [classes.InputElement];

    if (!valid && touched) {
        inputClasses.push(classes.Invalid);
    }

    switch (type) {
        case "input":
            inputElement = (
                <input
                    className={inputClasses.join(" ")}
                    value={inputValue}
                    onChange={inputChanged}
                />
            );
            break;
        case "password":
            inputElement = (
                <input
                    type="password"
                    className={inputClasses.join(" ")}
                    value={inputValue}
                    onChange={inputChanged}
                />
            );
            break;
        case "textArea":
            inputElement = (
                <textarea
                    className={inputClasses.join(" ")}
                    value={inputValue}
                    onChange={inputChanged}
                />
            );
            break;

        default:
            inputElement = (
                <input
                    className={inputClasses.join(" ")}
                    value={inputValue}
                    onChange={inputChanged}
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
        <div className={classes.Input}>
            <label className={classes.Label}>{label}</label>
            {inputElement}
            {validationWarning}
        </div>
    );
};

export default InputCom;
