import React from "react";

import classes from "./DockCard.module.css";
import Button from "../UI/Button/Button";
import PropTypes from "prop-types";

const dockCard = (props) => {
    return (
        <div className={classes.DockCard}>
            <div>
                <p className={classes.CardTitle}>{props.dock.name}</p>
                <p>{getshortenedDescription(props.dock.description)}</p>
                <p>
                    <b>length</b> {props.dock.length}
                </p>
                <p>
                    <b>width</b> {props.dock.width}
                </p>
                <p>
                    <b>price</b> €{props.dock.price}
                </p>
                <p>
                    <b>facilities</b> {props.dock.numfacilities}
                </p>
            </div>
            <div>
                <Button clicked={props.remove} btnType="DockCardDanger">
                    Remove
                </Button>
            </div>
        </div>
    );
};

const getshortenedDescription = (description) => {
    if (description.length > 90){
        return description.substr(0, 90) + "...";
    }
    return description
}

dockCard.propTypes = {
    dock: PropTypes.object,
    remove: PropTypes.func,
};

export default dockCard;
