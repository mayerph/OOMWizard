import React from 'react'
import './App.css'
import { Switch, Route, Redirect } from 'react-router-dom'
import { SharedMeme } from './components/SharedMeme'
import { MainApp } from './components/MainApp'
import { NavBar } from './components/NavBar'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import reducers from './reducers'
import ReduxThunk from 'redux-thunk'
import MemeCanvas from './components/MemeCanvas/MemeCanvas'

function App() {
  return (
    <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
      <div className="App">
        <NavBar />
        <Switch>
          <Route path={'/'} exact component={MainApp} />
          <Route path={'/meme/:id'} exact component={SharedMeme} />
          <Route path={'/imagememe/'} exact component={MemeCanvas} />
          {/** 
          <Route
            path={'/memeslist/'}
            render={(props) => (
              <Grid container id="memes-list-container">
                <Grid item xs={4}>
                  <MemeSlideShow {...props} type="meme" />
                </Grid>
                <Grid item xs={8}>
                  <MemesList {...props} type="meme" />
                </Grid>
              </Grid>
            )}
          />
            */}
          <Redirect to="/" />
        </Switch>
      </div>
    </Provider>
  )
}

export default App
