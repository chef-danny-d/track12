import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../App'
import axios from 'axios'
import { entryFetch, fetchLocation } from './helper'

export default function Nav() {
  const [entry, setEntry] = useState([]) //fetch from db
  const [data, setData] = useState({
    //what we submit aka form data
    lat: '',
    lng: '',
    presence: '',
    force: '',
    tactic: '',
  })
  const { state, dispatch } = useContext(AppContext) //shared data between map and nav

  const placeMarker = (value) => {
    const lat = value.lat()
    const lng = value.lng()
    dispatch({ type: 'UPDATE_INPUT', data: { lat, lng } })
  }

  useEffect(() => {
    entryFetch(setEntry)
  }, [])

  const change = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  function handle(e) {
    e.preventDefault()
    if (data.lat === '' && data.lng === '') {
      data.lat = state.lat
      data.lng = state.lng
    }
    const { lat, lng, presence, force, tactic } = data

    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS}`
      )
      .then(async (res) => {
        if (res.status == 200) {
          const address = res.data.results[0].formatted_address
          console.log(address)

          let values = await JSON.stringify({
            lat,
            lng,
            presence,
            force,
            tactic,
            address,
          })

          console.log(values)

          await axios
            .post(process.env.REACT_APP_URL, values, {
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then(() => {
              window.location.reload()
            })
            .catch((err) => console.error(err))
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  function getStreet(lat, lng) {
    const cord1 = lat
    const cord2 = lng
    const data = fetchLocation(cord1, cord2)
    console.log(data)
    return data
  }
  return (
    <div>
      <aside className="sidebar">
        <form className="form field" onSubmit={(e) => handle(e)}>
          <input
            className="form--input input is-static"
            type="text"
            name="lat"
            placeholder="latitude"
            onChange={(e) => change(e)}
            required
            value={state.lat}
            readOnly
          />
          <input
            className="form--input input is-static"
            type="text"
            name="lng"
            placeholder="longitude"
            onChange={(e) => change(e)}
            required
            value={state.lng}
            readOnly
          />
          <div className="control">
            <label className="label">Forces present</label>
            <label className="radio">
              <input
                type="radio"
                name="presence"
                value="heavy"
                onChange={(event) => change(event)}
                required
              />
              Heavy presence
            </label>
            <label className="radio">
              <input
                type="radio"
                name="presence"
                value="medium"
                onChange={(event) => change(event)}
                required
              />
              Medium presence
            </label>
            <label className="radio">
              <input
                type="radio"
                name="presence"
                value="low"
                onChange={(event) => change(event)}
                required
              />
              Low presence
            </label>
          </div>
          <div className="control">
            <label className="label">Forces' actions</label>
            <label className="radio">
              <input
                type="radio"
                name="tactic"
                value="stationary"
                onChange={(event) => change(event)}
                required
              />
              Stationary
            </label>
            <label className="radio">
              <input
                type="radio"
                name="tactic"
                value="chasing"
                onChange={(event) => change(event)}
                required
              />
              Chasing
            </label>
            <label className="radio">
              <input
                type="radio"
                name="tactic"
                value="marching"
                onChange={(event) => change(event)}
                required
              />
              Marching
            </label>
          </div>
          <div className="control">
            <label className="label">Force deployed</label>
            <label className="radio">
              <input
                type="radio"
                name="force"
                value="police"
                onChange={(event) => change(event)}
                required
              />
              Police
            </label>
            <label className="radio">
              <input
                type="radio"
                name="force"
                value="national guard"
                onChange={(event) => change(event)}
                required
              />
              National guard
            </label>
          </div>
          <button className="form--button button is-info">Add report</button>
        </form>
        <nav className="menu">
          <ul className="menu--list">
            {entry.map((doc) => (
              <div className="card menu--item" key={doc._id}>
                <header className="card-header">
                  <p className="card-header-title">
                    {doc.address || <span>Report</span>}
                  </p>
                </header>
                <div className="card-content">
                  <div className="content">
                    Spotted: <span>{Date(doc.spotted)}</span> <br />
                    Presence: <span>{doc.presence}</span>
                    <br />
                    Tactic: <span>{doc.tactic}</span>
                    <br />
                    Forces: <span>{doc.force}</span>
                    <br />
                  </div>
                </div>
              </div>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  )
}
