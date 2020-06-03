import React from 'react'
import './index.sass'
import WrappedMap from './components/Map'
import Nav from './components/Nav'

function App() {
  return (
    <div className="App">
      <Nav />
      <WrappedMap />
    </div>
  )
}

export default App
