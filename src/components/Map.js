import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../App'
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow,
} from 'react-google-maps'
import uuid from 'react-uuid'
import { entryFetch } from './helper'

function GMap() {
  const [loading, setLoading] = useState(true)
  const [selected, setSelect] = useState(null)
  const [entry, setEntry] = useState([])
  const [marker, setMarker] = useState([])
  const [userLocation, setUserLocation] = useState({
    lat: 0,
    lng: 0,
  })
  const { state, dispatch } = useContext(AppContext)

  useEffect(() => {
    entryFetch(setEntry)
    const listener = (e) => {
      if (e.key === 'Escape') {
        setSelect(null)
      }
    }
    window.addEventListener('keydown', listener)
    return () => {
      window.removeEventListener('keydown', listener)
    }
  }, [])

  const projectMarker = (value) => {
    const lat = value.lat()
    const lng = value.lng()
    dispatch({ type: 'UPDATE_INPUT', data: { lat, lng } })
  }

  const icon = (force) => {
    let obj = null
    if (force == 'police') {
      return (obj = {
        url:
          'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/237/police-cars-revolving-light_1f6a8.png',
        scaledSize: new window.google.maps.Size(25, 25),
      })
    } else if (force == 'national guard') {
      return (obj = {
        url:
          'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/237/military-medal_1f396.png',
        scaledSize: new window.google.maps.Size(35, 35),
      })
    } else {
      return null
    }
  }

  function remove(e) {
    if (e.latLng.lat() == marker[0].lat && e.latLng.lng() == marker[0].lng) {
      window.location.reload()
    }
  }

  function getPosition() {
    if (navigator.geolocation) {
      let options = {
        enableHighAccuracy: true,
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setLoading(false)
        },
        (err) => {
          console.error(err)
          setLoading(false)
        },
        options
      )
    }
    return (
      <Marker
        key={uuid()}
        position={userLocation}
        icon={{
          url:
            'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/237/round-pushpin_1f4cd.png',
          scaledSize: new window.google.maps.Size(30, 30),
        }}
      />
    )
  }

  return (
    <>
      <GoogleMap
        zoom={15}
        center={userLocation}
        options={{ disableDefaultUI: true, zoomControl: true }}
        onClick={(e) => {
          setMarker((current) => [
            ...current,
            {
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            },
          ])
          projectMarker(e.latLng)
        }}
      >
        {getPosition()}
        {marker.map((marker) => (
          <Marker
            key={uuid()}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={(e) => {
              remove(e)
            }}
          />
        ))}
        {entry.map((spot) => (
          <Marker
            key={spot._id}
            position={{
              lat: spot.lat,
              lng: spot.lng,
            }}
            onClick={() => {
              setSelect(spot)
            }}
            icon={icon(spot.force)}
          />
        ))}

        {selected && (
          <InfoWindow
            onCloseClick={() => {
              setSelect(null)
            }}
            position={{
              lat: selected.lat,
              lng: selected.lng,
            }}
          >
            <>
              <p className="info--text">
                Location: <span>{selected.address}</span>
              </p>
              <p className="info--text">
                Presence: <span>{selected.presence}</span>
              </p>
              <p className="info--text">
                Tactic: <span>{selected.tactic}</span>
              </p>
              <p className="info--text">
                Force: <span>{selected.force}</span>
              </p>
            </>
          </InfoWindow>
        )}
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
