import React from 'react'
import { Rnd } from 'react-rnd'
import { connect } from 'react-redux'

import './MemeSlideShow.css'

import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import { FormControlLabel, Checkbox, Paper } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import {
  getApi,
  getApiImgFlip,
  randomize,
  sortByLikes,
  autoplay,
} from '../../actions'

import Carousel from 'react-material-ui-carousel'

class MemeSlideShow extends React.Component {
  constructor(props) {
    super(props)
    props.getApi('api', props.type)
  }
  onApiLoad() {
    this.props.getApi('api', this.props.type)
  }
  randomize() {
    //this.props.randomize()
    this.props.getApi('random', this.props.type)
  }
  sortByLikes() {
    //this.props.sortByLikes()
    this.props.getApi('sort', this.props.type)
  }
  autoplay() {
    this.props.autoplay()
  }

  ///currently sorting the memes by title length
  render() {
    return (
      <div className="root">
        <Button onClick={this.randomize.bind(this)} variant="outlined">
          Randomize!
        </Button>
        <Button onClick={this.sortByLikes.bind(this)} variant="outlined">
          Sort by Likes!
        </Button>

        <Carousel
          interval={this.props.auto}
          autoPlay="false"
          navButtonsAlwaysVisible="true"
          index={this.props.active}
        >
          {this.props.tileData.map((tile) => (
            <Paper key={tile.id}>
              <h2>{tile.name}</h2>
              <img src={tile.url} alt={tile.name} className="slideImage" />
            </Paper>
          ))}
        </Carousel>

        <FormControlLabel
          control={
            <Checkbox
              onChange={this.autoplay.bind(this)}
              checked={this.props.auto !== '4000' ? false : true}
              value="autoplay"
              color="primary"
            />
          }
          label="Auto-play"
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(ownProps.type)
  console.log(state.api.tileData)
  console.log(state.api.active)
  if (ownProps.type == 'template') {
    return {
      ...state,
      tileData: state.api.tileData,
      auto: state.api.auto,
      active: state.api.active,
    }
  } else if (ownProps.type == 'meme') {
    return {
      ...state,
      tileData: state.api.tileDataMeme,
      auto: state.api.auto,
      active: state.api.active,
    }
  }
}

export default connect(mapStateToProps, {
  getApi,
  randomize,
  sortByLikes,
  autoplay,
})(MemeSlideShow)
