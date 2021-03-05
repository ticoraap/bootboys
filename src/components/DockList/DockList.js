import React, { Component } from "react";
import classes from "./DockList.module.css";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

// TODO: use functional component
class DockList extends Component {
    state = {
        redirect: false,
        dockid: 0,
    };

    onClickDockHandler = (id) => {
        this.setState({ dockid: id, redirect: true });
    };

    render() {
        if (this.state.redirect) {
            return (
                <Redirect
                    push
                    to={{
                        pathname: "/dock/" + this.state.dockid,
                    }}
                />
            );
        }

        const docklist = this.props.docks.map((value, index) => {
            return (
                <div
                    className={classes.RentableDockItem}
                    key={index}
                    onClick={() => this.onClickDockHandler(value.dockid)}
                >
                    <div id={"test"}>
                        <h3>{value.name}</h3>
                        <p>
                            <b>Price: &euro;</b> {value.price}
                        </p>
                        <p>
                            <b>Width:</b> {value.width} meters
                        </p>
                        <p>
                            <b>Length:</b> {value.length} meters
                        </p>
                        <p>
                            <b>Description:</b> {value.description}
                        </p>
                    </div>
                </div>
            );
        });

        return <div className={classes.DockList}>{docklist}</div>;
    }
}

DockList.propTypes = {
    mapUpdate: PropTypes.func,
    docks: PropTypes.array,
};

export default DockList;
