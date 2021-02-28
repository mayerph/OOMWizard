import React from 'react'
import { connect } from 'react-redux'

import './TileView.css'

import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import GetAppIcon from '@material-ui/icons/GetApp'
import ShareIcon from '@material-ui/icons/Share'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'

import { ShareDialog } from '../ShareDialog'
import { DownloadDialog } from '../DownloadDialog'
import { EditMemeDialog } from '../EditMemeDialog'
import axios from 'axios'

import Speech from 'react-speech'
import { Redirect } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import CreateIcon from '@material-ui/icons/Create'

import * as config from '../../config.json'
const destination = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`

/**
 * supported props:
 * - data: list of memes
 * - type: template/meme
 * - file_type: 'video' | 'img'
 */
class TileView extends React.Component {
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

  get_img_speech(tile) {
    let text = `The meme title is ${tile.name}.`
    text +=
      tile.captions && tile.captions.length > 0
        ? `And the captions say` + tile.captions.map((c) => c.text).toString()
        : 'And there are not captions'
    return text
  }

  upload_img_flip(tile) {
    fetch(tile.url)
      .then((res) => res.blob())
      .then((blob) => {
        var newfile = new File([blob], tile.name + '.jpg', { type: blob.type })
        var fd = new FormData()
        fd.append('template', newfile)
        axios.post(`${destination}/templates/`, fd, {}).then((res) => {
          console.log(res.statusText)
        })
      })
  }
  render_meta_info_subtitle(tile) {
    return (
      <>
        <div>
          <span>{`Rating: ${tile.meta_info.avg_rating} `}</span>
          <span>{`Views: ${tile.meta_info.views} `}</span>
        </div>
        <div>
          <span>{`Comments: ${tile.meta_info.comments} `}</span>
          {tile.timestamp ? <span>{`Created: ${tile.timestamp} `}</span> : null}
        </div>
      </>
    )
  }

  render_content(tile) {
    switch (tile.file_type) {
      case 'video':
        return (
          <video
            className="meme-video"
            autoPlay
            loop
            muted
            onClick={() => this.props.triggerFocus(tile.id)}
          >
            <source src={tile.route} type="video/mp4" />
          </video>
        )
      case 'img':
      default:
        return (
          <img
            src={tile.url}
            onClick={() => this.props.triggerFocus(tile.id)}
            alt={tile.name}
            className="gridImg"
          />
        )
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

  render_img_template(tile, index) {
    return (
      <GridListTile key={tile.id} cols={tile.cols || 1}>
        {this.render_content(tile)}
        <GridListTileBar
          title={tile.name}
          subtitle={this.render_meta_info_subtitle(tile)}
          actionIcon={
            <div className="actionButtons">
              {/** text to speech */}
              <IconButton>
                <Speech text={`The template title is ${tile.name}`} />
              </IconButton>

              {
                /** add edit create meme button */
                tile.foreign || tile.file_type != 'img'
                  ? null
                  : this.render_edit_meme_button(tile)
              }

              {/**Add upload button for imageflip */}
              {tile.foreign ? (
                <IconButton>
                  <CloudUploadIcon
                    aria-label="upload"
                    onClick={() => this.upload_img_flip(tile)}
                  ></CloudUploadIcon>
                </IconButton>
              ) : null}
            </div>
          }
        />
      </GridListTile>
    )
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

  render_img_meme(tile, index) {
    return (
      <GridListTile key={tile.id} cols={tile.cols || 1}>
        <img
          src={tile.url}
          alt={tile.name}
          className="gridImg"
          onClick={() => this.props.triggerFocus(tile.id)}
        />
        <GridListTileBar
          title={tile.name}
          subtitle={this.render_meta_info_subtitle(tile)}
          actionIcon={
            <div className="actionButtons">
              {/** text to speech */}
              <IconButton>
                <Speech text={this.get_img_speech(tile)} />
              </IconButton>

              {/** download button*/}
              <IconButton
                aria-label="download"
                onClick={() => this.downloadGeneratedImage(tile)}
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

  render_tile(tile, index) {
    switch (tile.type) {
      case 'meme':
        return this.render_img_meme(tile, index)
      case 'template':
        return this.render_img_template(tile, index)
      default:
        console.log('unsupported meme type', tile)
        return null
    }
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
        <EditMemeDialog
          meme_data={this.state.prompt_edit}
          open={this.state.prompt_edit ? true : false}
          onClose={() => {
            this.setState({ prompt_edit: undefined })
          }}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(TileView)
