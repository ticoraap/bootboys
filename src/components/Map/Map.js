import React, { Component } from "react";
import PropTypes from "prop-types";

import { latLngBounds, latLng } from "leaflet";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";

class ReactMap extends Component {
    makeBoundingBox = (boundMapToMarkers, docks) => {
        if (!boundMapToMarkers || !docks.length) return null;

        const boundingBox = latLngBounds(
            latLng(docks[0].latitude, docks[0].longitude),
            latLng(docks[0].latitude, docks[0].longitude)
        );
        docks.forEach((dock) => {
            boundingBox.extend(latLng(dock.latitude, dock.longitude));
        });

        return boundingBox;
    };

    createMarkerArray = (docks) => {
        return docks.map((dock) => (
            <Marker
                key={dock.dockid}
                position={{ lat: dock.latitude, lng: dock.longitude }}
            >
                <Popup>
                    Name dock: {dock.name} <br />
                    Length: {dock.length} meter <br />
                    Width: {dock.width} meter <br />
                    Price: &euro; {dock.price}
                </Popup>
            </Marker>
        ));
    };

    render() {
        let boundingBox = this.makeBoundingBox(
            this.props.boundMapToMarkers,
            this.props.docks
        );
        let markers = this.createMarkerArray(this.props.docks);

        return (
            <Map
                center={this.props.center}
                zoom={this.props.zoom}
                bounds={boundingBox}
                doubleClickZoom={false}
                closePopupOnClick={false}
                dragging={true}
                zoomSnap={false}
                zoomDelta={true}
                trackResize={true}
                touchZoom={true}
                scrollWheelZoom={false}
                boundsOptions={{ padding: [150, 150] }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {markers}
            </Map>
        );
    }
}

ReactMap.propTypes = {
    docks: PropTypes.array,
    boundMapToMarkers: PropTypes.bool,
    center: PropTypes.array,
    zoom: PropTypes.number,
    bounds: PropTypes.bool,
};

export default ReactMap;
