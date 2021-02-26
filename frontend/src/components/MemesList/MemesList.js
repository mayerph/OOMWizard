import React from 'react'
import { Rnd } from 'react-rnd'
import { connect } from 'react-redux'

import './MemesList.css'

import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import GetAppIcon from '@material-ui/icons/GetApp'
import ShareIcon from '@material-ui/icons/Share'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'

import { changeActive } from '../../actions'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share'

import { EmailIcon, FacebookIcon, WhatsappIcon } from 'react-share'
import { ShareDialog } from '../ShareDialog'
import { DownloadDialog } from '../DownloadDialog'
import axios from 'axios'
import { useEffect } from 'react'

import HearingIcon from '@material-ui/icons/Hearing'
import Speech from 'react-speech'
import { Redirect } from 'react-router-dom'
import { Typography } from '@material-ui/core'

/**
 * supported props:
 * - data: list of memes
 * - type: template/meme
 */
class MemesList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      prompt_share: undefined,
      prompt_download: undefined,
      opening: undefined,
    }
  }

  on_click_image(index, url) {}

  prompt_download(tile) {
    if (this.props.type == 'template') {
      this.setState({
        ...this.state,
        prompt_download: {
          id: tile.id,
          name: tile.name,
          route: tile.route,
          template: tile,
          captions: [],
        },
      })
    } else {
      this.setState({
        ...this.state,
        prompt_download: tile,
      })
    }
  }

  prompt_share(tile) {
    if (this.props.type == 'template') {
      this.setState({
        prompt_share: {
          id: tile.id,
          name: tile.name,
          route: tile.route,
          template: tile,
          captions: [],
        },
      })
    } else {
      this.setState({
        prompt_share: tile,
      })
    }
  }

  get_speech(tile) {
    if (this.props.type === 'template') {
      return 'The template title is ' + tile.name
    } else {
      let text = `The meme title is ${tile.name}.`
      text +=
        tile.captions && tile.captions.length > 0
          ? `And the captions say` + tile.captions.map((c) => c.text).toString()
          : 'And there are not captions'
      return text
    }
  }

  upload_img_flip(tile) {
    fetch(tile.url)
      .then((res) => res.blob())
      .then((blob) => {
        var newfile = new File([blob], tile.name + '.jpg', { type: blob.type })
        var fd = new FormData()
        fd.append('template', newfile)
        axios.post('http://localhost:2000/templates/', fd, {}).then((res) => {
          console.log(res.statusText)
        })
      })
  }

  render_tile(tile, index) {
    return (
      <GridListTile key={tile.id} cols={tile.cols || 1}>
        <img
          src={tile.url}
          alt={tile.name}
          className="gridImg"
          onClick={() => this.on_click_image(index, tile.url)}
        />
        <GridListTileBar
          title={tile.name}
          subtitle={''}
          actionIcon={
            <div className="actionButtons">
              {/** text to speech */}
              <IconButton>
                <Speech text={this.get_speech(tile)} />
              </IconButton>

              {/** download button */}
              <IconButton
                aria-label="download"
                onClick={() => {
                  this.prompt_download(tile)
                }}
                download
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

              {/** share button */}
              <IconButton
                aria-label="share-btn"
                onClick={() => {
                  this.prompt_share(tile)
                }}
              >
                <ShareIcon
                  style={{
                    color: '#fafafa',
                    fontSize: 15,
                    backgroundColor: '#2196f3',
                    borderRadius: 5,
                    padding: 2,
                  }}
                />
              </IconButton>
            </div>
          }
        />
      </GridListTile>
    )
  }

  render() {
    return (
      <>
        <GridList cellHeight={500} className="gridList" cols={4}>
          {this.props.data.map((tile, index) => this.render_tile(tile, index))}

          {
            //show message if no memes are present
            this.props.data.length == 0 ? (
              <Typography>No Memes found :(</Typography>
            ) : null
          }
        </GridList>
        <ShareDialog
          meme={this.state.prompt_share}
          open={this.state.prompt_share ? true : false}
          onClose={() => {
            this.setState({ prompt_share: undefined })
          }}
        ></ShareDialog>
        <DownloadDialog
          meme={this.state.prompt_download}
          open={this.state.prompt_download ? true : false}
          onClose={() => {
            this.setState({ prompt_download: undefined })
          }}
        ></DownloadDialog>
      </>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return { ...ownProps }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(MemesList)
