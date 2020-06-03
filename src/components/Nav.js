import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Nav() {
  const initialEntry = {
    entry: [
      {
        _id: '5ed71fa022fe3b8dc8ebcd6c',
        lat: 37.54129,
        lng: -77.434769,
        presence: 'medium',
        force: 'police',
        tactic: 'stationary',
        numReports: 1,
      },
    ],
    loading: true,
  }

  const [entry, setEntry] = useState(initialEntry)

  // useEffect(() => {
  //
  //   entryFetch().then(() => {
  //     const item = entry.entry
  //   })
  // }, [])

  const entryFetch = () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    axios.get('http://localhost:3600/', config).then((res) => {
      console.log(res)
      //setEntry(res.data)
    })
    //setEntry(data)
  }

  entryFetch()

  return (
    <div>
      <aside className="sidebar">
        <form>
          <input type="text" name="lat" placeholder="latitude" />
          <input type="text" name="lng" placeholder="longitude" />
          <input
            type="text"
            name="presence"
            placeholder="heavy or medium or low"
          />
          <input
            type="text"
            name="force"
            placeholder="police or national guard"
          />
          <input
            type="text"
            name="tactic"
            placeholder="stationary or chasing or marching"
          />
          <button>Add listing</button>
        </form>
        <nav className="menu">
          <ul className="menu--list">
            {entry.entry.map((doc) => (
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
