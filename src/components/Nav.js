import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../App'
import axios from 'axios'
import { entryFetch } from './helper'

export default function Nav(props) {
  const [entry, setEntry] = useState([])
  const [data, setData] = useState({
    lat: '',
    lng: '',
    presence: '',
    force: '',
    tactic: '',
  })
  const { state, dispatch } = useContext(AppContext)

  const placeMarker = (value) => {
    const lat = value.lat()
    const lng = value.lng()
    dispatch({ type: 'UPDATE_INPUT', data: { lat, lng } })
  }

  useEffect(() => {
    entryFetch(axios, setEntry)
  }, [])

  const change = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  function handle(e) {
    e.preventDefault()
    if (data.lat == '' && data.lng == '') {
      data.lat = state.lat
      data.lng = state.lng
    }
    const { lat, lng, presence, force, tactic } = data

    let values = JSON.stringify({
      lat,
      lng,
      presence,
      force,
      tactic,
    })

    axios
      .post(`http://localhost:3600`, values, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        const { lat, lng, precence, force, tactic } = res.data
        props.location.reload()
      })
      .catch((err) => console.error(err))
  }

  return (
    <div>
      <aside className="sidebar">
        <form className="form" onSubmit={(e) => handle(e)}>
          <input
            className="form--input"
            type="text"
            name="lat"
            placeholder="latitude"
            onChange={(e) => change(e)}
            required
            value={state.lat}
          />
          <input
            className="form--input"
            type="text"
            name="lng"
            placeholder="longitude"
            onChange={(e) => change(e)}
            required
            value={state.lng}
          />
          <input
            className="form--input"
            type="text"
            name="presence"
            placeholder="heavy or medium or low"
            onChange={(e) => change(e)}
            required
          />
          <input
            className="form--input"
            type="text"
            name="force"
            placeholder="police or national guard"
            onChange={(e) => change(e)}
            required
          />
          <input
            className="form--input"
            type="text"
            name="tactic"
            placeholder="stationary or chasing or marching"
            onChange={(e) => change(e)}
            required
          />
          <button className="form--button">Add report</button>
        </form>
        <nav className="menu">
          <ul className="menu--list">
            {entry.map((doc) => (
              <li className="menu--item" key={doc._id}>
                <div className="menu--row">
                  <span className="menu--component">{doc.lat}</span>
                  <span className="menu--component">{doc.lng}</span>
                </div>
                <div className="menu--row">
                  <span className="menu--component">{doc.presence}</span>
                  <span className="menu--component">{doc.force}</span>
                  <span className="menu--component">{doc.tactic}</span>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  )
}
