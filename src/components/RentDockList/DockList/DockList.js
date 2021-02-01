import React, { Component } from "react";
import { ApiService } from "../../shared/Api.service";
import "./DockList.css";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

export default class DockList extends Component {
    allDocks = [];
    filteredDocks = [];
    filters = [];

    state = {
        Docks: [],
        filteredDocks: [],
        redirect: false,
        dockid: 0,
    };

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

        return this.filteredDocks.map((value, index) => {
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

    onClickDockHandler(id) {
        this.setState({ dockid: id, redirect: true });
    }

    componentDidMount() {
        this.getAllDocks();
    }

    getAllDocks() {
        ApiService.get("/dock")
            .then((response) => response.json())
            .then(
                (response) => {
                    this.addResponseToDocksArray(response);
                },
                (onerror) => console.warn(onerror)
            );
    }

    addResponseToDocksArray(response) {
        if (response == null) return;

        for (const [key, value] of Object.entries(response)) {
            value.dockid = key;
            this.allDocks.push(value);
        }

        this.setFilteredDocks();
        this.setDockState();
        this.UpdateMap();
    }

    setDockState() {
        this.setState({
            Docks: this.allDocks,
            filteredDocks: this.filteredDocks,
        });
    }

    setFilteredDocks() {
        this.filteredDocks = this.allDocks;
    }

    filterDocks($event, dockName, minimumLength, maxPrice, minimumWidth) {
        this.filters = [dockName, minimumLength, maxPrice, minimumWidth];

        if (this.checkRefreshListNeeded($event, this.filters)) {
            this.setFilteredDocks();
        }
        this.filter();
    }

    checkRefreshListNeeded(event) {
        // return this.checkIfKeyIsBackSpace(event);
    }

    checkIfKeyIsBackSpace(event) {
        return event.keyCode === 8;
    }

    checkIfFieldIsEmpty(filters) {
        let isEmptyOrUndefined = false;
        filters.forEach((filter) => {
            if (filter === "" || filter === undefined) {
                isEmptyOrUndefined = true;
            }
        });
        return isEmptyOrUndefined;
    }

    filter() {
        this.clearFilteredDocks();
        this.checkFilters();
        this.filterContainsDockName();
        this.filterMaximumPrice();
        this.filterMinimumLength();
        this.filterMinimumWidth();
        this.setDockState();
        this.UpdateMap();
    }

    UpdateMap() {
        this.props.mapUpdate();
    }

    filterContainsDockName() {
        this.filteredDocks = this.allDocks.filter((dock) =>
            this.compare(dock.name, this.filters[0])
        );
    }

    filterMaximumPrice() {
        this.filteredDocks = this.filteredDocks.filter(
            (dock) => dock.price <= this.filters[2]
        );
    }

    filterMinimumLength() {
        this.filteredDocks = this.filteredDocks.filter(
            (dock) => dock.length >= this.filters[1]
        );
    }

    filterMinimumWidth() {
        this.filteredDocks = this.filteredDocks.filter(
            (dock) => dock.width >= this.filters[3]
        );
    }

    clearFilteredDocks() {
        this.filteredDocks = [];
    }

    compare(name, dockName) {
        return this.lowerCase(name).includes(this.lowerCase(dockName));
    }

    lowerCase(input) {
        return input.toLowerCase();
    }

    checkIfFilledMaxPrice() {
        if (this.checkIfFieldIsEmpty([this.filters[2]])) {
            this.filters[2] = Number.MAX_VALUE;
        }
    }

    checkIfFilledMinLength() {
        if (this.checkIfFieldIsEmpty([this.filters[1]])) {
            this.filters[1] = 0;
        }
    }

    checkFilters() {
        this.checkIfFilledMaxPrice();
        this.checkIfFilledMinLength();
    }
}

DockList.propTypes = {
    mapUpdate: PropTypes.func,
};
