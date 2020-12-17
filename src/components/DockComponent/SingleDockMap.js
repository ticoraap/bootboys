import React, {Component} from "react";
import {Map, Marker, TileLayer} from "react-leaflet";

export default class SingleDockMap extends Component{
     DEFAULT_VIEWPORT = {
        center: [51.505, -0.09],
        zoom: 13,
    }
    BASE_LONG = -157.952746;
    BASE_LAT = 21.362270;

    constructor() {
        super();
        this.state = {
            lat: this.BASE_LAT,
            long: this.BASE_LONG,
            viewport: this.DEFAULT_VIEWPORT
        }
    }

    render() {
        const position = [this.state.lat, this.state.long]
        return(
        <Map viewport={this.state.viewport} zoom={this.state.zoom}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}/>
        </Map>
        )
    }

    updateMap(lat, long){
        const view = {
            center: [lat, long],
            zoom: 13,
        }
        this.setState({
            viewport: view,
            lat: lat,
            long: long
        })
    }
}
