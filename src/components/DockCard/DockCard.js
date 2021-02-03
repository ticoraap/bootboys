import React from "react";

import classes from "./DockCard.module.css";
import Button from "../UI/Button/Button";
import PropTypes from "prop-types";

const dockCard = (props) => {
    let classNames = [classes.DockCard];

    if (props.styleName) {
        classNames.push(classes[props.styleName]);
    }

    return (
        <div className={classNames.join(" ")}>
            <div>
                <p>{props.name}</p>
                <p>{props.description.substr(0, 90) + "..."}</p>
                <p>
                    <b>length</b> {props.length}
                </p>
                <p>
                    <b>width</b> {props.width}
                </p>
                <p>
                    <b>price</b> €{props.price}
                </p>
                <p>
                    <b>facilities</b> {props.numFacilities}
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

dockCard.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    length: PropTypes.number,
    width: PropTypes.number,
    price: PropTypes.number,
    numFacilities: PropTypes.number,
    styleName: PropTypes.string,
    remove: PropTypes.func,
};

export default dockCard;
