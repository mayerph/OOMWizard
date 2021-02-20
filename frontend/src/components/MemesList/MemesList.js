import React from 'react'
import { Rnd } from 'react-rnd'
import { connect } from 'react-redux'

import './MemesList.css'

import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import GetAppIcon from '@material-ui/icons/GetApp'
import ShareIcon from '@material-ui/icons/Share'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'

import { getApi, getApiImgFlip, uploadUrl, changeActive } from '../../actions'
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

class MemesList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { memeToShare: undefined, memeToDownload: undefined }
    props.getApi('api', props.type)
  }

  onApiLoad() {
    this.props.getApi('api', this.props.type)
  }
  onApiIMGFlipLoad() {
    this.props.getApiImgFlip('api', this.props.type)
  }
  uploadUrl() {
    this.props.uploadUrl('')
  }
  updateActive(index) {
    console.log(this.props)
    console.log(index)
    this.props.changeActive(this.props, index)
  }

  render() {
    return (
      <div className="root">
        {this.props.type === 'template' ? (
          <Button onClick={this.onApiLoad.bind(this)} variant="outlined">
            Load OOMWizard Templates
          </Button>
        ) : null}
        {this.props.type === 'template' ? (
          <Button onClick={this.onApiIMGFlipLoad.bind(this)} variant="outlined">
            Load IMGFlip Templates
          </Button>
        ) : null}

        <GridList cellHeight={500} className="gridList" cols={4}>
          {this.props.tileData.map((tile, index) => (
            <GridListTile
              key={tile.id}
              cols={tile.cols || 1}
              onClick={() => {
                console.log(index)
                this.updateActive(index)
              }}
            >
              <img src={tile.url} alt={tile.name} className="gridImg" />
              <GridListTileBar
                title={tile.name}
                subtitle={'likes: ' + tile.name.length}
                actionIcon={
                  <div className="actionButtons">
                    <IconButton>
                      <Speech text={tile.name} />
                    </IconButton>

                    <IconButton
                      aria-label="upvote"
                      onClick={() => {
                        if (tile.url.split('.')[1] == 'imgflip') {
                          fetch(tile.url)
                            .then((res) => res.blob())
                            .then((blob) => {
                              console.log(blob)
                              var newfile = new File(
                                [blob],
                                tile.name + '.jpg',
                                {
                                  type: blob.type,
                                },
                              )
                              console.log(newfile)
                              var fd = new FormData()
                              fd.append('template', newfile)
                              axios
                                .post(
                                  'http://localhost:2000/templates/',
                                  fd,
                                  {},
                                )
                                .then((res) => {
                                  console.log(res.statusText)
                                })
                                .then((result) => {
                                  //this.onApiLoad()
                                })
                            })
                        } else {
                          alert(
                            'feature can only be used on the imgflip images',
                          )
                        }
                      }}
                    >
                      <CloudUploadIcon
                        style={{
                          color: '#fafafa',
                          fontSize: 15,
                          backgroundColor: '#388e3c',
                          borderRadius: 5,
                          padding: 2,
                        }}
                      />
                    </IconButton>

                    {/* <IconButton aria-label="downvote">
                      <ArrowDownwardIcon
                        style={{
                          color: '#fafafa',
                          fontSize: 15,
                          backgroundColor: '#f4511e',
                          borderRadius: 5,
                          padding: 2,
                        }}
                      />
                    </IconButton> */}
                    <IconButton
                      aria-label="download"
                      onClick={() => {
                        if (this.props.type == 'template') {
                          this.setState({
                            ...this.state,
                            memeToDownload: {
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
                            memeToDownload: tile,
                          })
                        }
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
                    <IconButton
                      aria-label="share-btn"
                      onClick={() => {
                        if (this.props.type == 'template') {
                          this.setState({
                            ...this.state,
                            memeToShare: {
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
                            memeToShare: tile,
                          })
                        }
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
          ))}
        </GridList>
        <ShareDialog
          meme={this.state.memeToShare}
          open={this.state.memeToShare ? true : false}
          onClose={() => {
            this.setState({ ...this.state, memeToShare: undefined })
          }}
        ></ShareDialog>
        <DownloadDialog
          meme={this.state.memeToDownload}
          open={this.state.memeToDownload ? true : false}
          onClose={() => {
            this.setState({ ...this.state, memeToDownload: undefined })
          }}
        ></DownloadDialog>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(ownProps.type)
  console.log(state.api.tileData)
  if (ownProps.type == 'template') {
    return {
      ...state,
      tileData: state.api.tileData,
    }
  } else if (ownProps.type == 'meme') {
    return {
      ...state,
      tileData: state.api.tileDataMeme,
    }
  }
}

export default connect(mapStateToProps, {
  getApi,
  getApiImgFlip,
  changeActive,
})(MemesList)
