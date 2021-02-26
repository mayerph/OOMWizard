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

import CommentSection from '../Comments/CommentList'
import HeartRating from '../Rating/HeartRating'
import StatsView from '../StatsView/StatsView'

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
                onClick={() => {}} //TODO
                src={tile.url}
                alt={tile.name}
              />

              <HeartRating style={{}} identifier={tile.id} />

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
