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
} from '@material-ui/core'

import ToogleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'

import ViewCarouselIcon from '@material-ui/icons/ViewCarousel'
import ViewComfyIcon from '@material-ui/icons/ViewComfy'
import RefreshIcon from '@material-ui/icons/Refresh'

import MemesList from '../MemesList/MemesList'
import MemeSlideShow from '../MemeSlideShow/MemeSlideShow'

class MemeView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'gallery',
      sort_by: 'rating',
      source: 'omm',
      data: undefined,
    }
  }

  load_img_flip() {
    //TODO with config
    fetch('https://api.imgflip.com/get_memes', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((results) => {
        this.setState({
          source: 'ImgFlip',
          data: results.data.memes,
        })
      })
  }

  load_omm_wizard() {
    fetch('http://localhost:2000/memes/', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((results) => {
        var tileData = results
        for (var i = 0; i < tileData.length; i++) {
          tileData[i].route = 'http://localhost:2000' + tileData[i].route
          tileData[i].url = tileData[i].route
        }
        this.setState({
          source: 'omm',
          data: tileData,
        })
      })
  }

  load_data(source = this.state.source) {
    if (source === 'omm') {
      this.load_omm_wizard()
    } else {
      this.load_img_flip()
    }
  }

  componentDidMount() {
    if (!this.state.data) {
      this.load_data()
    }
  }

  setSource(source) {
    console.log('setting source: ', source)
    this.setState({ data: undefined, source: source })
    this.load_data(source)
  }

  create_memes_list() {
    //TODO filter and sort
    return this.state.data
  }

  render() {
    return (
      <Container style={{ marginTop: '10px' }}>
        <Card>
          <form>
            <Box display="flex" bgcolor="background.paper">
              <Box component="span" flexGrow={1} m={1}>
                <InputBase placeholder="Filter.."></InputBase>
              </Box>

              {/** refesh button */}
              <Box component="span" m={1}>
                <Button onClick={() => this.load_data()}>
                  <RefreshIcon fontSize="small" />
                </Button>
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
                  <option value={'omm'}>OOMWizard</option>
                  <option value={'ImgFlip'}>ImgFlip</option>
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
              <MemesList data={this.create_memes_list()} />
            ) : (
              <MemeSlideShow data={this.create_memes_list()} />
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
    username: state.auth.username,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(MemeView)
