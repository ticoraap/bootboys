import React, { Component } from "react";
import classes from "./DockSearcher.module.css";
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
    }

    handleOnChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    getFilteredDocks = () => {
        const newFilteredDocks = [];
        for (const dock of this.props.docks) {
            let satisfiesFilter = true;

            satisfiesFilter = this.isInputInDockName(dock) && satisfiesFilter;
            satisfiesFilter =
                this.isDockPriceWithinMaxPrice(dock) && satisfiesFilter;
            satisfiesFilter =
                this.isDockLengthWithinMaxLength(dock) && satisfiesFilter;
            satisfiesFilter =
                this.isDockWidthWithinMaxWidth(dock) && satisfiesFilter;

            if (satisfiesFilter) {
                newFilteredDocks.push({...dock});
            }
        }
        return newFilteredDocks;
    };

    isInputInDockName = (dock) => {
        return dock.name.toLowerCase().includes(this.state.dockName);
    };

    isDockPriceWithinMaxPrice = (dock) => {
        if (this.state.price === "") {
            return true;
        }
        return dock.price <= this.state.price;
    };

    isDockLengthWithinMaxLength = (dock) => {
        if (this.state.length === "") {
            return true;
        }
        return dock.length <= this.state.length;
    };

    isDockWidthWithinMaxWidth = (dock) => {
        if (this.state.width === "") {
            return true;
        }
        return dock.width <= this.state.width;
    };

    render() {
        const filteredDocks = this.getFilteredDocks();

        return (
            <div>
                <div className={classes.Inputs}>
                    <TextField
                        onChange={(event) => this.handleOnChange(event)}
                        value={this.state.dockName}
                        name={"dockName"}
                        label={"Name of dock"}
                        size={"medium"}
                        className={classes.SearchDock}
                    />
                    <TextField
                        onChange={(event) => this.handleOnChange(event)}
                        value={this.state.price}
                        name={"price"}
                        label={"Maximum price in euro's"}
                        size={"medium"}
                        type={"number"}
                        className={classes.SearchDock}
                    />
                    <TextField
                        onChange={(event) => this.handleOnChange(event)}
                        value={this.state.length}
                        name={"length"}
                        label={"Minimum length in meters"}
                        size={"medium"}
                        type={"number"}
                        className={classes.SearchDock}
                    />
                    <TextField
                        onChange={(event) => this.handleOnChange(event)}
                        value={this.state.width}
                        name={"width"}
                        label={"Minimum width in meters"}
                        size={"medium"}
                        type={"number"}
                        className={classes.SearchDock}
                    />
                </div>

                <div className={classes.Wrapper}>
                    <div>
                        <DockList docks={filteredDocks} />
                    </div>
                    <div className={classes.MapDocks}>
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
