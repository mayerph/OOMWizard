import React from 'react'
import './App.css'
import { Switch, Route } from 'react-router-dom'
import { SharedMeme } from './components/SharedMeme'
import { MainApp } from './components/MainApp'

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path={'/'} exact component={MainApp} />
        <Route path={'/meme/:id'} exact component={SharedMeme} />
      </Switch>
    </div>
  )
}

export default App
