import React from 'react'
import { Rnd } from 'react-rnd'
import { connect } from 'react-redux'

import './MemeSlideShow.css'

import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import { FormControlLabel, Checkbox, Paper } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { getApi, randomize, sortByLikes, autoplay } from '../../actions'

import Carousel from 'react-material-ui-carousel'

class MemeSlideShow extends React.Component {
  onApiLoad() {
    this.props.getApi()
  }
  randomize() {
    this.props.randomize()
  }
  sortByLikes() {
    this.props.sortByLikes()
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
        >
          {this.props.tileData.map((tile) => (
            <Paper key="">
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

const mapStateToProps = (state) => {
  console.log(state.api.auto)
  return {
    tileData: state.api.tileData,
    auto: state.api.auto,
  }
}

export default connect(mapStateToProps, {
  getApi,
  randomize,
  sortByLikes,
  autoplay,
})(MemeSlideShow)
