import React, { Component } from 'react'
import './styles/App.css'
import Header from './components/presentational/Header'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
      </div>
    )
  }
}

export default App