import React, { Component } from "react";
import "./DockSearcher.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as actions from "../../store/actions/index";

import DockList from "../../components/DockList/DockList";
import DockMap from "../../components/DockMap/DockMap";
import TextField from "@material-ui/core/TextField";

class DockSearcher extends Component {
    state = {
        dockName: "",
        price: "",
        length: "",
        width: "",
        docks: [],
        filteredDocks: [],
    };

    componentDidMount() {
        this.props.onGetAllDocks();
        this.getFilteredDocks();
    }

    handleOnChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    getFilteredDocks = () => {
        const newFilteredDocks = [];
        for (const [dockid, dock] of Object.entries(this.props.docks)) {
            let satisfiesFilter = true;

            satisfiesFilter =
                this.isInputInDockName(dock, this.state.dockName) &&
                satisfiesFilter;
            satisfiesFilter =
                this.isDockPriceWithinMaxPrice(dock, this.state.price) &&
                satisfiesFilter;
            satisfiesFilter =
                this.isDockLengthWithinMaxLength(dock, this.state.length) &&
                satisfiesFilter;
            satisfiesFilter =
                this.isDockWidthWithinMaxWidth(dock, this.state.width) &&
                satisfiesFilter;

            if (satisfiesFilter) {
                dock.dockid = dockid;
                newFilteredDocks.push(dock);
            }
        }
        return newFilteredDocks
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

        const filteredDocks = this.getFilteredDocks()

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
                        <DockList docks={filteredDocks} />
                    </div>
                    <div id={"mapDocks"}>
                        <DockMap docks={filteredDocks} />
                    </div>
                </div>
            </div>
        );
    }
}

DockSearcher.propTypes = {
    docks: PropTypes.any,
    onGetAllDocks: PropTypes.func,
};

const mapStateToProps = (state) => {
    return {
        docks: state.dock.allDocks,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onGetAllDocks: () => dispatch(actions.getAllDocks()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DockSearcher);
