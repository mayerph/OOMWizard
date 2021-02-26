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
  Check,
  Button,
  Switch,
  FormControlLabel,
} from '@material-ui/core'

import ToogleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'

import ViewCarouselIcon from '@material-ui/icons/ViewCarousel'
import ViewComfyIcon from '@material-ui/icons/ViewComfy'
import RefreshIcon from '@material-ui/icons/Refresh'

import MemesList from '../MemesList/MemesList'
import MemeSlideShow from '../MemeSlideShow/MemeSlideShow'

import { randomizeTD } from '../../reducers/apigetter'
import { set } from 'lodash'

class MemeView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'gallery',
      focused_gallery_item: undefined,
      ownedOnly: false,
      sort_by: 'rating',
      source: 'omm',
      data: undefined,
      filter: undefined,
    }
  }

  expand_with_meta_info(source, data) {
    let formData = new FormData()
    formData.set('identifiers', JSON.stringify(data.map((e) => e.id)))
    fetch('http://localhost:2000/meta/', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((meta_infos) => {
        let result = data.map((e, i) => {
          return {
            ...e,
            ...meta_infos[i],
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
    //TODO with config
    fetch('https://api.imgflip.com/get_memes', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((results) => {
        for (var meme of results.data.memes) {
          meme.type = 'img_meme'
        }
        this.expand_with_meta_info('ImgFlip', results.data.memes)
      })
  }

  load_omm_wizard() {
    fetch('http://localhost:2000/memes/', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((results) => {
        for (var meme of results) {
          meme['route'] = 'http://localhost:2000' + meme.route
          meme.url = meme.route
          meme.type = 'img_meme'
        }
        this.expand_with_meta_info('omm', results)
      })
  }

  load_omm_wizard_templates() {
    fetch('http://localhost:2000/templates/', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((results) => {
        for (var template of results) {
          template.route = 'http://localhost:2000' + template.route //FIXME add some other information?
          template.url = template.route
          template.type = 'img_template'
        }
        this.expand_with_meta_info('omm_templates', results)
      })
  }

  load_data(source = this.state.source) {
    switch (source) {
      case 'omm':
        this.load_omm_wizard()
        break
      case 'omm_templates':
        this.load_omm_wizard_templates()
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
          bTime = b.timestamp ? Date.parse(b.timestamp) : 0
          aTime = a.timestamp ? Date.parse(a.timestamp) : 0
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
      result = result.filter((e, i) => e.name.includes(this.state.filter))
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
    return (
      <Container style={{ marginTop: '10px' }}>
        <Card>
          <form>
            <Box display="flex" bgcolor="background.paper">
              <Box component="span" flexGrow={1} m={1}>
                <InputBase
                  placeholder="Filter.."
                  onChange={(e) => this.setState({ filter: e.target.value })}
                ></InputBase>
              </Box>

              {/** refesh button */}
              <Box component="span" m={1}>
                <Button onClick={() => this.load_data()}>
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
                >
                  <option value={'omm'}>Wizard Memes</option>
                  <option value={'omm_templates'}>Wizard Templates</option>
                  <option value={'ImgFlip'}>ImgFlip Memes</option>
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
                  <ToggleButton value="gallery">
                    <ViewCarouselIcon fontSize="small" />
                  </ToggleButton>
                  <ToggleButton value="grid">
                    <ViewComfyIcon fontSize="small" />
                  </ToggleButton>
                </ToogleButtonGroup>
              </Box>
            </Box>
          </form>
          <Divider />
          {this.state.data ? (
            this.state.mode == 'grid' ? (
              <MemesList
                data={this.create_memes_list()}
                triggerFocus={(id) => alert('implement focus for', id)}
              />
            ) : (
              <MemeSlideShow
                data={this.create_memes_list()}
                focus={this.state.focused_gallery_item}
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

export default connect(mapStateToProps, mapDispatchToProps)(MemeView)
