import React from 'react'
import './MainApp.css'
import { NavBar } from '../NavBar'
import { MemeCanvas } from '../MemeCanvas'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'

import { MemesList } from '../MemesList'
import { MemeSlideShow } from '../MemeSlideShow'

import ReduxThunk from 'redux-thunk'
import { applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducers from '../../reducers'
import TextControl from '../TextControl/TextControl'

class MainApp extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
        <div className="App">
          <NavBar />
          <Grid container>
            <Grid item xs />
            <Grid item>
              <TextControl />
            </Grid>
            <Grid item xs />
          </Grid>
          <Grid container>
            <Grid item xs />
            <Grid item id="meme-canvas-container">
              <Grid item container>
                <Grid item xs />
                <Grid item xs>
                  <MemeCanvas />
                </Grid>
                <Grid item xs />
              </Grid>
            </Grid>

            <Grid container id="memes-list-container">
              <Grid item xs={4}>
                <MemeSlideShow />
              </Grid>
              <Grid item xs={8}>
                <MemesList />
              </Grid>
            </Grid>
            <Grid item xs />
          </Grid>
        </div>
      </Provider>
    )
  }
}

MainApp.propTypes = {}

export default MainApp
