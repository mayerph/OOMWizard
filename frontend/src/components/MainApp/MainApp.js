import React from 'react'
import './MainApp.css'
import Grid from '@material-ui/core/Grid'

import { MemesList } from '../MemesList'
import { MemeSlideShow } from '../MemeSlideShow'
import { ImageUpload } from '../ImageUpload'
import { ImageUrlUpload } from '../ImageUrlUpload'
import { ImageScreenshotUpload } from '../ImageScreenshotUpload'
import { ImagePainter } from '../ImagePainter'
import { MemePhotoCapture } from '../MemePhotoCapture'
import { Link } from 'react-router-dom'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Paper from '@material-ui/core/Paper'

import {
  Movie,
  InsertPhoto,
  CameraAlt,
  Brush,
  Gif,
  PhotoLibrary,
  VideoLibrary,
  CollectionsBookmark,
  CloudUpload,
} from '@material-ui/icons'
import LinkIcon from '@material-ui/icons/Link'
import { VideoTemplates } from '../VideoTemplates'
import { VideoMemes } from '../VideoMemes'
import { MemeView } from '../MemeView'

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
              aria-label="tabs"
              centered
            >
              <Tab label="Image Templates" icon={<InsertPhoto />} />
              <Tab label="Upload Image" icon={<CloudUpload />} />
              <Tab label="Link Image" icon={<LinkIcon />} />
              <Tab label="Take Picture" icon={<CameraAlt />} />
              <Tab label="Draw Image" icon={<Brush />} />
              <Tab label="Gif Templates" icon={<Gif />} />
              <Tab label="Video Templates" icon={<Movie />} />
              <Tab label="Image Memes" icon={<PhotoLibrary />} />
              <Tab label="Video Memes" icon={<VideoLibrary />} />
              <Tab label="Gif Memes" icon={<CollectionsBookmark />} />
            </Tabs>
          </Paper>
          <div hidden={this.state.newValue !== 0}>
            <MemeView />
            {/*
            <Grid container id="memes-list-container">
              <Grid item xs={4}>
                <MemeSlideShow type="template" />
              </Grid>
              <Grid item xs={8}>
                <MemesList type="template" />
              </Grid>
            </Grid>
            */}
          </div>
          <div hidden={this.state.newValue !== 1}>
            <ImageUpload />
          </div>
          <div hidden={this.state.newValue !== 2}>
            <h1>Upload an image from the internet!</h1>
            <ImageUrlUpload />
            <h1>Take a Screenshot!</h1>
            <ImageScreenshotUpload />
          </div>
          <div hidden={this.state.newValue !== 3}>
            <MemePhotoCapture />
          </div>
          <div hidden={this.state.newValue !== 4}>
            <ImagePainter />
          </div>
          <div hidden={this.state.newValue !== 5}>
            <Link
              to={{
                pathname: '/imagememe',
              }}
            >
              image
            </Link>
          </div>
          <div hidden={this.state.newValue !== 6}>
            <VideoTemplates></VideoTemplates>
          </div>
          <div hidden={this.state.newValue !== 7}>
            {/* <Link
              to={{
                pathname: '/memeslist',
                state: {
                  tileData: {
                    route: '/images/templates/Drake-Hotline-Bling.jpg',
                    name: 'Image',
                    author: ' author',
                  },
                  apitype: 'default',
                  type: 'meme',
                },
              }}
            >
              To list of created Memes
            </Link> */}
            {/** 
            <Grid container id="memes-list-container">
              <Grid item xs={4}>
                <MemeSlideShow type="meme" />
              </Grid>
              <Grid item xs={8}>
                <MemesList type="meme" />
              </Grid>
            </Grid>
            */}
          </div>
          <div hidden={this.state.newValue !== 8}>
            <VideoMemes></VideoMemes>
          </div>
          <div hidden={this.state.newValue !== 9}>Gif Memes</div>
        </div>
      </div>
    )
  }
}

MainApp.propTypes = {}

export default MainApp
