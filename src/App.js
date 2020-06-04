import React, { createContext, useReducer, useState } from 'react'
import './index.sass'
import WrappedMap from './components/Map'
import Nav from './components/Nav'
import Color from './components/Color'

export const AppContext = createContext()

const initialState = {
  lat: '',
  lng: '',
}

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_INPUT':
      return { lat: action.data.lat, lng: action.data.lng }
    default:
      return initialState
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <div className="App">
      <Color />
      <div className="container">
        <AppContext.Provider value={{ state, dispatch }}>
          <Nav />
          <WrappedMap />
        </AppContext.Provider>
      </div>
    </div>
  )
}

export default App
