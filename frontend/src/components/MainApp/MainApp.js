import React from 'react'
import './MainApp.css'
import Grid from '@material-ui/core/Grid'

import { MemesList } from '../MemesList'
import { MemeSlideShow } from '../MemeSlideShow'
import { ImageUpload } from '../ImageUpload'
import { ImageUrlUpload } from '../ImageUrlUpload'
import { ImagePainter } from '../ImagePainter'
import { MemePhotoCapture } from '../MemePhotoCapture'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Paper from '@material-ui/core/Paper'

class MainApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newValue: 0,
    }
  }

  handleChange = (event, newValue) => {
    this.setState({
      newValue: newValue,
    })
  }
  render() {
    return (
      <div className="App">
        <div>
          <Paper square>
            <Tabs
              value={this.state.newValue}
              onChange={this.handleChange}
              aria-label="simple tabs example"
              centered
            >
              <Tab label="Image Templates" />
              <Tab label="Upload Image" />
              <Tab label="Link Image" />
              <Tab label="Take Picture" />
              <Tab label="Draw Image" />
              <Tab label="Gif Templates" />
              <Tab label="Image Templates" />
            </Tabs>
          </Paper>
          <div hidden={this.state.newValue !== 0}>
            <Grid container id="memes-list-container">
              <Grid item xs={4}>
                <MemeSlideShow />
              </Grid>
              <Grid item xs={8}>
                <MemesList />
              </Grid>
            </Grid>
          </div>
          <div hidden={this.state.newValue !== 1}>
            <ImageUpload />
          </div>
          <div hidden={this.state.newValue !== 2}>
            <ImageUrlUpload />
          </div>
          <div hidden={this.state.newValue !== 3}>
            <MemePhotoCapture />
          </div>
          <div hidden={this.state.newValue !== 4}>
            <ImagePainter />
          </div>
          <div hidden={this.state.newValue !== 5}>Gif templates</div>
          <div hidden={this.state.newValue !== 6}>Video templates</div>
        </div>
      </div>
    )
  }
}

MainApp.propTypes = {}

export default MainApp
