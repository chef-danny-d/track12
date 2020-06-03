import React, { useState, useEffect } from 'react'
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
} from 'react-google-maps'

function GMap(props) {
  const [selected, setSelect] = useState(null)
  return (
    <>
      <GoogleMap defaultZoom={10} defaultCenter={{ lat: 45.42, lng: -75.69 }}>
        <Marker
          key={1}
          position={{ lat: 47, lng: -60 }}
          onClick={() => {
            //setSelect(this)
          }}
        />
      </GoogleMap>
    </>
  )
}

const WrappedMap = withScriptjs(withGoogleMap(GMap))

const Map = () => {
  return (
    <div className="map">
      <WrappedMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_MAPS}`}
        loadingElement={<div style={{ height: '100%' }} />}
        containerElement={<div style={{ height: '100%' }} />}
        mapElement={<div style={{ height: '100%' }} />}
      />
    </div>
  )
}

export default Map
