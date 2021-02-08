import React from 'react';
import PropTypes from 'prop-types'

import {latLngBounds, latLng} from 'leaflet'
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import Auxilary from '../../HOC/Auxiliary/Auxiliary'

const map = ( props ) => {

    let options = {
        doubleClickZoom: false, 
        closePopupOnClick: false, 
        dragging: true, 
        zoomSnap: false, 
        zoomDelta: true, 
        trackResize: true,
        touchZoom: true,
        scrollWheelZoom: false,
    }

    if (props.defaultOptions){
        options = {}
    }

    let bounds = null
    if (props.bounds && props.docks.length){
        bounds = latLngBounds(latLng(props.docks[0].latitude,props.docks[0].longitude),latLng(props.docks[0].latitude,props.docks[0].longitude))
        props.docks.forEach(dock => {
            bounds.extend(latLng(dock.latitude,dock.longitude))
        })
    }

    let markers = props.docks.map(dock => {
        return (
            <Marker key={dock.dockid} position={{lat: dock.latitude, lng: dock.longitude}}>
                <Popup>
                    Name dock: {dock.name} <br/>
                    Length: {dock.length} meter <br/>
                    Width: {dock.width} meter <br/>
                    Price: &euro; {dock.price}
                </Popup>
            </Marker>
        )        
    })
    
    let renderMap = (
        <Map  id={props.id} center={props.center} zoom={props.zoom} {...options}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            {markers}
        </Map>
    )

    if (bounds !== null){

        renderMap = (
            <Map bounds={bounds} id={props.id} {...options} boundsOptions={{padding: [70, 70]}}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                {markers}
            </Map>
        )
    } 

    return(
        <Auxilary>
            {renderMap}
        </Auxilary>
    )
}

map.propTypes = {
    center: PropTypes.array,
    id: PropTypes.string,
    zoom: PropTypes.number,
    docks: PropTypes.array,
    dockids: PropTypes.string,
    defaultOptions: PropTypes.bool,
    bounds: PropTypes.bool,
};

export default map;