import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import {
  FormControlLabel,
  Checkbox,
  Paper,
  DialogTitle,
  Typography,
  Button,
  Box,
} from '@material-ui/core'
import CommentSection from '../Comments/CommentList'
import HeartRating from '../Rating/HeartRating'

import Carousel from 'react-material-ui-carousel'
import './MemeSlideShow.css'

class MemeSlideShow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current: undefined,
      autoplay: false,
    }
  }

  //TODO remove and refactor
  goToMemeCanvas(url) {
    if (this.state.pictureUrl === null) {
      console.log(url)
      this.setState({
        pictureUrl: url,
      })
    }
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
          index={this.props.active}
        >
          {this.props.data.map((tile) => (
            <Box key={tile.id} align={'center'} m={1}>
              <h2>{tile.name}</h2>
              <img
                className="slideImage"
                onClick={() => {
                  this.goToMemeCanvas(tile.url)
                }}
                src={tile.url}
                alt={tile.name}
              />
              <HeartRating style={{}} identifier={tile.id} />
              <CommentSection meme_id={tile.id} />
            </Box>
          ))}
        </Carousel>
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
export default connect(mapStateToProps, mapDispatchToProps)(MemeSlideShow)
