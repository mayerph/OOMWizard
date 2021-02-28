import React from 'react'
import { connect } from 'react-redux'

import {
  Typography,
  Container,
  Select,
  Card,
  InputBase,
  Box,
  Divider,
  CircularProgress,
  Button,
  Switch,
  FormControlLabel,
} from '@material-ui/core'

import ToogleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'

import ViewCarouselIcon from '@material-ui/icons/ViewCarousel'
import ViewComfyIcon from '@material-ui/icons/ViewComfy'
import RefreshIcon from '@material-ui/icons/Refresh'

import TileView from './TileView'
import GalleryView from './GalleryView'

import { randomizeTD } from '../../reducers/apigetter'

import {
  speechtocontrolmultiplehome,
  speechtotextreturn,
} from '../speechtotext/speechtotext.js'
import IconButton from '@material-ui/core/IconButton'
import MicIcon from '@material-ui/icons/Mic'
import Chip from '@material-ui/core/Chip'
import './Overview.css'

import * as config from '../../config.json'
const destination = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`

class Overview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'gallery',
      gallery_focus: undefined,
      gallery_autoplay: false,
      ownedOnly: false,
      sort_by: 'rating',
      source: 'omm_memes',
      data: undefined,
      filter: undefined,
    }
  }

  expand_with_meta_info(source, data) {
    let formData = new FormData()
    formData.set('identifiers', JSON.stringify(data.map((e) => e.id)))
    fetch(`${destination}/meta/`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((meta_infos) => {
        console.log('wizard:', data)
        let result = data.map((e, i) => {
          return {
            ...e,
            ...meta_infos[i],
            fileending: '.' + e.url.split('.').slice(-1)[0],
          }
        })
        console.log('Loaded:', result)
        this.setState({
          source: source,
          data: result,
        })
      })
  }

  load_img_flip() {
    fetch('https://api.imgflip.com/get_memes', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((results) => {
        for (var meme of results.data.memes) {
          meme.type = 'template'
          meme.foreign = true
          meme.file_type = 'img'
        }
        this.expand_with_meta_info('ImgFlip', results.data.memes)
      })
  }

  load_omm_wizard(key, base, is_meme, file_type) {
    fetch(`${destination}${base}${is_meme ? '/memes/' : '/templates/'}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((results) => {
        for (var e of results) {
          e['route'] = destination + e.route
          e.url = e.route
          e.type = is_meme ? 'meme' : 'template'
          e.file_type = file_type
        }
        this.expand_with_meta_info(key, results)
      })
  }

  load_data(source = this.state.source) {
    switch (source) {
      case 'omm_memes':
        this.load_omm_wizard(source, '', true, 'img')
        break
      case 'omm_templates':
        this.load_omm_wizard(source, '', false, 'img')
        break
      case 'omm_gif_templates':
        this.load_omm_wizard(source, '/gif', false, 'gif')
        break
      case 'omm_gif_memes':
        this.load_omm_wizard(source, '/gif', true, 'gif')
        break
      case 'omm_video_memes':
        this.load_omm_wizard(source, '/video', true, 'video')
        break
      case 'omm_video_templates':
        this.load_omm_wizard(source, '/video', false, 'video')
        break
      case 'ImgFlip':
        this.load_img_flip()
        break
      default:
        console.log('No valid load data specifier')
    }
  }

  componentDidMount() {
    if (!this.state.data) {
      this.load_data()
    }
  }

  sort(items) {
    switch (this.state.sort_by) {
      case 'views':
        return items.sort((a, b) => b.meta_info.views - a.meta_info.views)
      case 'comments':
        return items.sort((a, b) => b.meta_info.comments - a.meta_info.comments)
      case 'rating':
        return items.sort(
          (a, b) => b.meta_info.avg_rating - a.meta_info.avg_rating,
        )
      case 'date':
        return items.sort((a, b) => {
          let bTime = b.timestamp ? Date.parse(b.timestamp) : 0
          let aTime = a.timestamp ? Date.parse(a.timestamp) : 0
          return bTime - aTime
        })
      case 'random':
      default:
        return randomizeTD(items)
    }
  }

  setSource(source) {
    console.log('setting source: ', source)
    this.setState({ data: undefined, source: source })
    this.load_data(source)
  }

  create_memes_list() {
    var result = this.state.data
    if (this.state.filter && this.state.filter != '') {
      let filter = this.state.filter.toLowerCase()
      result = result.filter((e, i) => {
        return (
          e.name.toLowerCase().includes(filter) ||
          e.fileending.toLowerCase().includes(filter)
        )
      })
    }
    if (this.state.ownedOnly) {
      result = result.filter((e, i) => {
        return e.owner && e.owner == this.props.username
      })
    }
    result = this.sort(result)
    return result
  }

  render() {
    let trying = false
    let tryingtwo = false
    return (
      <Container style={{ marginTop: '10px' }} className="overview">
        <Card>
          <form>
            <Box display="flex" bgcolor="background.paper">
              <Box component="span" flexGrow={1} m={1}>
                <InputBase
                  placeholder="Filter.."
                  onChange={(e) => this.setState({ filter: e.target.value })}
                  id="filtertextfield"
                ></InputBase>
                <IconButton
                  variant="contained"
                  color="primary"
                  id="filtertextfieldbutton"
                  onClick={() => {
                    speechtotextreturn(trying)
                    const results = document.getElementById('results').innerHTML
                    if (trying) {
                      document.getElementById('filtertextfield').value = results
                      this.setState({ filter: results })
                      document.getElementById(
                        'filtertextfieldbutton',
                      ).style.backgroundColor = 'white'
                    } else {
                      document.getElementById(
                        'filtertextfieldbutton',
                      ).style.backgroundColor = 'red'
                    }

                    trying = !trying
                  }}
                >
                  <MicIcon />
                </IconButton>
                <span id="results" hidden></span>
              </Box>

              {/** refesh button */}
              <Box component="span" m={1}>
                <Button onClick={() => this.load_data()} id="overviewrefresh">
                  <RefreshIcon fontSize="small" />
                </Button>
              </Box>

              {/** own meme filter */}
              <Box component="span" m={1}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.ownedOnly}
                      onChange={(e) => {
                        this.setState({ ownedOnly: e.target.checked })
                      }}
                      id="overviewowned"
                    />
                  }
                  label="Owned"
                />
              </Box>

              {/** sort */}
              <Box component="span" m={1}>
                <Select
                  native
                  value={this.state.sort_by}
                  onChange={(e) => {
                    this.setState({ sort_by: e.target.value })
                  }}
                  label="sort by"
                  id="overviewsort"
                >
                  <option value={'rating'}>Sorted by rating</option>
                  <option value={'views'}>Sorted by views</option>
                  <option value={'date'}>Sorted by date</option>
                  <option value={'comments'}>Sorted by comments</option>
                  <option value={'random'}>randomized</option>
                </Select>
              </Box>
              {/** source imageflip or own */}
              <Box component="span" m={1}>
                <Select
                  native
                  value={this.state.source}
                  onChange={(e) => {
                    this.setSource(e.target.value)
                  }}
                  id="overviewselect"
                >
                  <option value={'omm_memes'}>Wizard Memes</option>
                  <option value={'omm_templates'}>Wizard Templates</option>
                  <option value={'omm_gif_memes'}>Wizard Gif Memes</option>
                  <option value={'omm_gif_templates'}>
                    Wizard Gif Templates
                  </option>
                  <option value={'omm_video_memes'}>Wizard Video Memes</option>
                  <option value={'omm_video_templates'}>
                    Wizard Video Templates
                  </option>
                  <option value={'ImgFlip'}>ImgFlip Templates</option>
                </Select>
              </Box>

              <Box component="span" m={1}>
                <ToogleButtonGroup
                  size="small"
                  value={this.state.mode}
                  exclusive
                  onChange={(e, next) => {
                    this.setState({ mode: next })
                  }}
                >
                  <ToggleButton value="gallery" id="overviewgallery">
                    <ViewCarouselIcon fontSize="small" />
                  </ToggleButton>
                  <ToggleButton value="grid" id="overviewtile">
                    <ViewComfyIcon fontSize="small" />
                  </ToggleButton>
                </ToogleButtonGroup>
              </Box>
            </Box>
          </form>
          <IconButton
            variant="contained"
            color="secondary"
            id="overviewcommandbutton"
            onClick={() => {
              speechtocontrolmultiplehome(
                [
                  'overviewrefresh',
                  'overviewowned',
                  'overviewgallery',
                  'overviewtile',
                  'overviewsort',
                  'overviewsort',
                  'overviewsort',
                  'overviewsort',
                  'overviewsort',
                  'overviewselect',
                  'overviewselect',
                  'overviewselect',
                  'overviewselect',
                  'overviewselect',
                  'overviewselect',
                  'overviewselect',
                  'carouseldownloadbutton',
                  'gonext',
                  'gobefore',
                ],
                [
                  'refresh',
                  'show owned',
                  'show gallery',
                  'show tile',
                  'sort by rating',
                  'sort by views',
                  'sort by date',
                  'sort by comments',
                  'sort by random',
                  'show memes',
                  'show templates',
                  'show gif memes',
                  'show gif templates',
                  'show video memes',
                  'show video templates',
                  'show image flip',
                  'download image',
                  'next image',
                  'previous image',
                ],
              )
              const results = document.getElementById('resultstwo').innerHTML
              if (tryingtwo) {
                console.log(results)
                if (results.split(' ')[0] === 'sort') {
                  console.log('made it into sort')
                  this.setState({ sort_by: results.split(' ').pop() })
                } else if (results.split(' ')[0] === 'showing') {
                  this.setSource(results.split(' ')[1])
                }
                document.getElementById(
                  'overviewcommandbutton',
                ).style.backgroundColor = 'white'
              } else {
                document.getElementById(
                  'overviewcommandbutton',
                ).style.backgroundColor = 'red'
              }
              tryingtwo = !tryingtwo
            }}
          >
            <MicIcon />
          </IconButton>
          <Chip icon={<MicIcon />} label="refresh" color="secondary" />
          <Chip icon={<MicIcon />} label="show owned" color="secondary" />
          <Chip icon={<MicIcon />} label="show gallery" color="secondary" />
          <Chip icon={<MicIcon />} label="show tile" color="secondary" />
          <Chip
            icon={<MicIcon />}
            label="sort by (rating/views/date/comments/random)"
            color="secondary"
          />
          <Chip
            icon={<MicIcon />}
            label="show ((gif/video)memes/templates/image flip)"
            color="secondary"
          />
          <Chip icon={<MicIcon />} label="next image" color="secondary" />
          <Chip icon={<MicIcon />} label="previous image" color="secondary" />
          <Chip icon={<MicIcon />} label="download image" color="secondary" />
          <span id="resultstwo" hidden></span>
          <Divider />
          {this.state.data ? (
            this.state.mode == 'grid' ? (
              <TileView
                data={this.create_memes_list()}
                triggerFocus={(id) =>
                  this.setState({
                    mode: 'gallery',
                    gallery_focus: id,
                  })
                }
              />
            ) : (
              <GalleryView
                data={this.create_memes_list()}
                focus={this.state.gallery_focus}
              />
            )
          ) : (
            <CircularProgress />
          )}
        </Card>
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    // logging in should trigger an update, because new memes may be retrieved
    username: state.auth.username,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview)
