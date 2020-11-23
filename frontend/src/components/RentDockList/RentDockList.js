import React, {Component} from "react"
import DockList from "./DockList/DockList";
import "./RentDockList.css"
import TextField from "@material-ui/core/TextField";
import DockMap from "./DockMap/DockMap";

export default class RentDockList extends Component {


    state = {
        dockName: '',
        price: '',
        length: '',
        width: ''
    }

    constructor() {
        super();
        this.DockListElement = React.createRef();
        this.DockMapElement = React.createRef();
        this.updateMap = this.updateMap.bind(this)
    }

    render() {
        return (
            <div>
                <div id={'inputs'}>
                    <TextField onChange={this.handleOnChange.bind(this)} value={this.state.dockName} name={'dockName'}
                               label={'Name of dock'} onKeyUp={this.searchDock.bind(this)} size={'medium'}
                               className={'searchDock'}/>
                    <TextField onChange={this.handleOnChange.bind(this)} value={this.state.price} name={'price'}
                               label={"Maximum price in euro's"} onKeyUp={this.searchDock.bind(this)} size={'medium'}
                               type={'number'} className={'searchDock'}/>
                    <TextField onChange={this.handleOnChange.bind(this)} value={this.state.length} name={'length'}
                               label={'Minimum length in meters'} onKeyUp={this.searchDock.bind(this)} size={'medium'}
                               type={'number'} className={'searchDock'}/>
                    <TextField onChange={this.handleOnChange.bind(this)} value={this.state.width} name={'width'}
                               label={'Minimum width in meters'} onKeyUp={this.searchDock.bind(this)} size={'medium'}
                               type={'number'} className={'searchDock'}/>
                </div>

                <div id={'wrapper'}>
                    <div>
                        <DockList mapUpdate={this.updateMap} ref={this.DockListElement} id={'RentableDocks'}/>
                    </div>
                    <div id={'mapDocks'}>
                        <DockMap ref={this.DockMapElement}/>
                    </div>
                </div>
            </div>
        )
    }

    handleOnChange(e) {
        const {target: {value, name}} = e;
        this.setState({
            [name]: value
        });
    }

    updateMap() {
        this.DockMapElement.current.setDataForMarkers(this.getFilteredDocks())
    }

    searchDock(event) {
        this.DockListElement.current.filterDocks(event, this.state.dockName, this.state.length, this.state.price, this.state.width)
    }

    getFilteredDocks() {
        return this.DockListElement.current.filteredDocks;
    }
}
