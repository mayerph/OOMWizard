import React from 'react'
import './MainApp.css'

import { ImageUpload } from '../ImageUpload'
import { ImageUrlUpload } from '../ImageUrlUpload'
import { ImageScreenshotUpload } from '../ImageScreenshotUpload'
import { ImagePainter } from '../ImagePainter'
import { MemePhotoCapture } from '../MemePhotoCapture'
import { Link } from 'react-router-dom'
import { Overview } from '../Overview'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

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
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye'

import { VideoTemplates } from '../VideoTemplates'
import { VideoMemes } from '../VideoMemes'
import Card from '@material-ui/core/Card'

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
              <Tab label="Overview" icon={<RemoveRedEyeIcon />} />
              <Tab label="Create Image Template" icon={<CloudUpload />} />
              <Tab label="Create Gif Meme" icon={<Gif />} />
              <Tab label="Create Video Meme" icon={<Movie />} />
              <Tab label="REMOVE?? Video Memes" icon={<VideoLibrary />} />
              <Tab label="REMOVE?? Gif Memes" icon={<CollectionsBookmark />} />
            </Tabs>
          </Paper>
          <div hidden={this.state.newValue !== 0}>
            <Overview />
          </div>
          <div hidden={this.state.newValue !== 1}>
            <div className="image-templates">
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Upload template</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ImageUpload />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>Upload template from url</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ImageUrlUpload />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>Screenshot template from url</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ImageScreenshotUpload />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>Create template from webcam picture</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <MemePhotoCapture />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>Draw template</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ImagePainter />
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
          <div hidden={this.state.newValue !== 2}>
            <Link
              to={{
                pathname: '/imagememe',
              }}
            >
              image
            </Link>
          </div>
          <div hidden={this.state.newValue !== 3}>
            <VideoTemplates></VideoTemplates>
          </div>
          <div hidden={this.state.newValue !== 4}>
            <VideoMemes></VideoMemes>
          </div>
          <div hidden={this.state.newValue !== 5}>Gif Memes</div>
        </div>
      </div>
    )
  }
}

MainApp.propTypes = {}

export default MainApp
