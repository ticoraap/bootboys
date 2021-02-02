import React, { Component } from "react";
import DockList from "./DockList/DockList";
import "./RentDockList.css";
import TextField from "@material-ui/core/TextField";
import DockMap from "./DockMap/DockMap";
import httpService from "../../shared/httpService";
import { Api } from "../../api";


class RentDockList extends Component {
    state = {
        dockName: "",
        price: "",
        length: "",
        width: "",
        docks: [],
        filteredDocks: [],
    };

    componentDidMount() {
        this.fetchAllDocks();
    }

    fetchAllDocks() {
        Api.dock.getAll()
            .then((docks) => {
                this.setState({ docks: docks });
                this.filterDocks();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleOnChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });

        this.filterDocks();
    }

    filterDocks = () => {
        this.setState((oldState) => {
            const newFilteredDocks = [];
            for (const [dockid, dock] of Object.entries(this.state.docks)) {
                let satisfiesFilter = true;

                satisfiesFilter =
                    this.isInputInDockName(dock, oldState.dockName) &&
                    satisfiesFilter;
                satisfiesFilter =
                    this.isDockPriceWithinMaxPrice(dock, oldState.price) &&
                    satisfiesFilter;
                satisfiesFilter =
                    this.isDockLengthWithinMaxLength(dock, oldState.length) &&
                    satisfiesFilter;
                satisfiesFilter =
                    this.isDockWidthWithinMaxWidth(dock, oldState.width) &&
                    satisfiesFilter;

                if (satisfiesFilter) {
                    newFilteredDocks.push(dock);
                }
            }
            return { filteredDocks: newFilteredDocks };
        });
    };

    isInputInDockName = (dock, nameInput) => {
        return dock.name.toLowerCase().includes(nameInput);
    };

    isDockPriceWithinMaxPrice = (dock, priceInput) => {
        if (priceInput === "") {
            return true;
        }
        return dock.price <= priceInput;
    };

    isDockLengthWithinMaxLength = (dock, lengthInput) => {
        if (lengthInput === "") {
            return true;
        }
        return dock.length <= lengthInput;
    };

    isDockWidthWithinMaxWidth = (dock, widthInput) => {
        if (widthInput === "") {
            return true;
        }
        return dock.width <= widthInput;
    };

    render() {
        return (
            <div>
                <div id={"inputs"}>
                    <TextField
                        onChange={(event) => this.handleOnChange(event)}
                        value={this.state.dockName}
                        name={"dockName"}
                        label={"Name of dock"}
                        size={"medium"}
                        className={"searchDock"}
                    />
                    <TextField
                        onChange={(event) => this.handleOnChange(event)}
                        value={this.state.price}
                        name={"price"}
                        label={"Maximum price in euro's"}
                        size={"medium"}
                        type={"number"}
                        className={"searchDock"}
                    />
                    <TextField
                        onChange={(event) => this.handleOnChange(event)}
                        value={this.state.length}
                        name={"length"}
                        label={"Minimum length in meters"}
                        size={"medium"}
                        type={"number"}
                        className={"searchDock"}
                    />
                    <TextField
                        onChange={(event) => this.handleOnChange(event)}
                        value={this.state.width}
                        name={"width"}
                        label={"Minimum width in meters"}
                        size={"medium"}
                        type={"number"}
                        className={"searchDock"}
                    />
                </div>

                <div id={"wrapper"}>
                    <div>
                        <DockList
                            docks={this.state.filteredDocks}
                        />
                    </div>
                    <div id={"mapDocks"}>
                        <DockMap docks={this.state.filteredDocks} />
                    </div>
                </div>
            </div>
        );
    }
}

export default RentDockList;
