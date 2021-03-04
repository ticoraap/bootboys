import React, { useState } from "react";
import classes from "./Select.module.css";

const Select = ({
    id,
    label,
    value,
    invalidMessage,
    placeholder,
    options,
    notifyParentOfChange,
    className,
    ...props
}) => {
    const [touched, setTouched] = useState(false);
    const [valid, setValid] = useState(true);

    function inputChanged(event) {
        setTouched(true);
        setValid(event.target.value !== "");
        notifyParentOfChange(id, event.target.value, event.target.value !== "");
    }

    const selectClasses = [classes.SelectElement];

    if (!valid && touched) {
        selectClasses.push(classes.Invalid);
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
            <select
                onChange={inputChanged}
                value={value}
                className={selectClasses.join(" ")}
            >
                <option value="" >
                    {placeholder ? placeholder : "Select a value"}
                </option>
                {options?.map((option) => {
                    return (
                        <option key={option.value} value={option.value}>
                            {option.displayValue}
                        </option>
                    );
                })}
            </select>
            {validationWarning}
        </div>
    );
};

export default Select;
