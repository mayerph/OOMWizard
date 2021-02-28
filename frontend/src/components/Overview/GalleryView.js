import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import {
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import IconButton from '@material-ui/core/IconButton'
import GetAppIcon from '@material-ui/icons/GetApp'
import CreateIcon from '@material-ui/icons/Create'

import CommentSection from '../Comments/CommentList'
import HeartRating from '../Rating/HeartRating'
import StatsView from '../StatsView/StatsView'
import { EditMemeDialog } from '../EditMemeDialog'

import Carousel from 'react-material-ui-carousel'
import './GalleryView.css'

class GalleryView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current: undefined,
      autoplay: false,
      focus_index: props.data.findIndex((e) => e.id === props.focus),
      prompt_edit: undefined,
    }
  }

  downloadGeneratedImage(tile) {
    const saveImg = document.createElement('a')
    saveImg.href = tile.url
    saveImg.target = '_blank'
    saveImg.download = 'meme.' + tile.fileending
    document.body.appendChild(saveImg)
    saveImg.click()
    document.body.removeChild(saveImg)
  }

  render_content(tile) {
    switch (tile.file_type) {
      case 'video':
        return (
          <video autoPlay loop controls height="400">
            <source src={tile.route} type="video/mp4" />
          </video>
        )
      case 'img':
      case 'gif':
      default:
        return <img className="slideImage" src={tile.url} alt={tile.name} />
    }
  }
  render_edit_meme_button(tile) {
    return (
      <IconButton>
        <CreateIcon
          aria-lable="edit"
          onClick={() =>
            this.setState({
              prompt_edit: tile,
            })
          }
        />
      </IconButton>
    )
  }

  render_carousel() {
    return (
      <>
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) => {
                this.setState({ autoplay: e.target.checked })
              }}
              checked={this.state.autoplay}
              value="autoplay"
              color="primary"
            />
          }
          label="Auto-play"
        />
        <Carousel
          interval={this.props.auto}
          autoPlay={this.state.autoplay}
          navButtonsAlwaysVisible="true"
          index={this.state.focus_index}
        >
          {this.props.data.map((tile) => (
            <Box key={tile.id} align={'center'} m={1}>
              <h2>{tile.name}</h2>
              {this.render_content(tile)}
              <HeartRating style={{}} identifier={tile.id} />

              {/** download button*/}
              <IconButton
                aria-label="download"
                onClick={() => this.downloadGeneratedImage(tile)}
                download
                id="carouseldownloadbutton"
              >
                <GetAppIcon
                  style={{
                    color: '#fafafa',
                    fontSize: 15,
                    backgroundColor: '#2196f3',
                    borderRadius: 5,
                    padding: 2,
                  }}
                />
              </IconButton>

              {
                /** add edit button, only if is template and not img flip */
                tile.foreign ||
                tile.type != 'template' ||
                tile.file_type != 'img'
                  ? null
                  : this.render_edit_meme_button(tile)
              }

              {/** stats */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Stats</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <StatsView identifier={tile.id} />
                </AccordionDetails>
              </Accordion>

              {/** comments */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Comment section</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <CommentSection identifier={tile.id} />
                </AccordionDetails>
              </Accordion>
            </Box>
          ))}
        </Carousel>
        <EditMemeDialog
          meme_data={this.state.prompt_edit}
          open={this.state.prompt_edit ? true : false}
          onClose={() => {
            this.setState({ prompt_edit: undefined })
          }}
        />
      </>
    )
  }

  render() {
    return this.props.data.length == 0 ? (
      <Typography>No Memes found :(</Typography>
    ) : (
      this.render_carousel()
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return { ...ownProps }
}
const mapDispatchToProps = (dispatch) => {
  return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(GalleryView)
