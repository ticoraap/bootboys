import React from "react";

import classes from "./DockCard.module.css";
import Button from "../UI/Button/Button";
import PropTypes from "prop-types";

const dockCard = ({ dock, remove }) => {
    return (
        <div className={classes.DockCard}>
            <div>
                <p className={classes.CardTitle}>{dock.name}</p>
                <p>{getshortenedDescription(dock.description)}</p>
                <p>
                    <b>length</b> {dock.length}
                </p>
                <p>
                    <b>width</b> {dock.width}
                </p>
                <p>
                    <b>price</b> €{dock.price}
                </p>
                <p>
                    <b>facilities</b> {dock.numfacilities}
                </p>
            </div>
            <div>
                <Button clicked={remove} btnType="DockCardDanger">
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
