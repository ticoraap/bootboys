import React, { Component } from "react";
import DockList from "./DockList/DockList";
import "./RentDockList.css";
import TextField from "@material-ui/core/TextField";
import DockMap from "./DockMap/DockMap";
import httpService from "../../shared/httpService";

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
        httpService
            .getAllDocks()
            .then((docks) => {
                this.setState({ docks: docks, filteredDocks: docks });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    constructor() {
        super();
        this.DockListElement = React.createRef();
        this.DockMapElement = React.createRef();
        this.updateMap = this.updateMap.bind(this);
    }

    render() {
        return (
            <div>
                <div id={"inputs"}>
                    <TextField
                        onChange={(event) => this.handleOnChange(event)}
                        value={this.state.dockName}
                        name={"dockName"}
                        label={"Name of dock"}
                        onKeyUp={this.searchDock.bind(this)}
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
                            mapUpdate={this.updateMap}
                            ref={this.DockListElement}
                            id={"RentableDocks"}
                        />
                    </div>
                    <div id={"mapDocks"}>
                        <DockMap ref={this.DockMapElement} />
                    </div>
                </div>
            </div>
        );
    }

    handleOnChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });

        this.searchDock();
        this.filterDocks();
    }

    filterDocks = () => {
        this.setState((oldState) => {
            const newFilteredDocks = {};
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
                    newFilteredDocks[dockid] = dock;
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

    searchDock(event) {
        this.DockListElement.current.filterDocks(
            event,
            this.state.dockName,
            this.state.length,
            this.state.price,
            this.state.width
        );
    }

    updateMap() {
        this.DockMapElement.current.setDataForMarkers(this.getFilteredDocks());
    }

    getFilteredDocks() {
        return this.DockListElement.current.filteredDocks;
    }
}

export default RentDockList;
