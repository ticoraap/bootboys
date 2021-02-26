import React, { useState } from "react";
import classes from './Select.module.css';


const Select = ({
    id,
    label,
    placeholder,
    invalidMessage,
    options,
    notifyParentOfChange,
    ...props
}) => {

    const [selectValue, setSelectValue] = useState(value);
    const [touched, setTouched] = useState(false);
    const [valid, setValid] = useState(true);
    
    function inputChanged(event) {
        setTouched(true);
        setSelectValue(event.target.value);
        setValid(true);
        notifyParentOfChange(id, event.target.value, true)
    }

    let selectElement = null;
    const selectClasses = [classes.SelectElement];

    if (!valid && touched) {
        selectClasses.push(classes.Invalid);
    }

    return (
        <div className={classes.Select}>
            <label className={classes.Label}>{label}</label>
            <select>
                
            </select>
            {validationWarning}
        </div>
    )

}