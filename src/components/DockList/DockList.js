import React, { Component } from "react";
import "./DockList.css";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

export default class DockList extends Component {
    state = {
        filteredDocks: [],
        redirect: false,
        dockid: 0,
    };

    onClickDockHandler(id) {
        this.setState({ dockid: id, redirect: true });
    }

    render() {
        if (this.state.redirect) {
            return (
                <Redirect
                    to={{
                        pathname: "/dock",
                        state: { id: this.state.dockid },
                    }}
                />
            );
        }

        return this.props.docks.map((value, index) => {
            return (
                <div
                    className={"rentableDockItem"}
                    key={index}
                    onClick={() => this.onClickDockHandler(value.dockid)}
                >
                    <div id={"test"}>
                        <p>Dock name: {value.name}</p>
                        <p>Dock width: {value.width} meter</p>
                        <p>Dock length: {value.length} meter</p>
                        <p>Dock price: &euro; {value.price}</p>
                        <p>Dock description: {value.description}</p>
                    </div>
                    <br />
                </div>
            );
        });
    }
}

DockList.propTypes = {
    mapUpdate: PropTypes.func,
    docks: PropTypes.array,
};
