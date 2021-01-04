import React from 'react'
import './App.css'
import { Switch, Route, Redirect } from 'react-router-dom'
import { SharedMeme } from './components/SharedMeme'
import { MainApp } from './components/MainApp'

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path={'/'} exact component={MainApp} />
        <Route path={'/meme/:id'} exact component={SharedMeme} />
        <Redirect to="/" />
      </Switch>
    </div>
  )
}

export default App
