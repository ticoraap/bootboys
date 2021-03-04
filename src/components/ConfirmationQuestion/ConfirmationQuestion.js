import React from "react";

import Button from "../UI/Button/Button";
import PropTypes from "prop-types";

const confirmationQuestion = (props) => (
    <div>
        <p>{props.question}</p>
        <Button clicked={props.accept}>{props.acceptLabel}</Button>
        <Button clicked={props.decline}>{props.declineLabel}</Button>
    </div>
);

confirmationQuestion.propTypes = {
    question: PropTypes.string,
    accept: PropTypes.func,
    acceptLabel: PropTypes.string,
    decline: PropTypes.func,
    declineLabel: PropTypes.string,
};

export default confirmationQuestion;
