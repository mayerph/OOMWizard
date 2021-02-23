import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Rating from '@material-ui/lab/Rating'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import FavoriteIcon from '@material-ui/icons/Favorite'
import Skeleton from '@material-ui/lab/Skeleton'
import {
  post_rating,
  load_rating as get_rating,
} from '../../actions/rating.actions'

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating)

class HeartRating extends React.Component {
  render() {
    if (
      !this.props.rating ||
      (this.props.username && !this.props.user_rating)
    ) {
      this.props.load_rating()
    }
    return (
      <Box
        style={{ textAlign: 'center' }}
        component="fieldset"
        mb={3}
        borderColor="transparent"
      >
        {
          // only display user rating if present
          this.props.user_rating ? (
            <Typography>
              Your rating: {this.props.user_rating.rating}/10
            </Typography>
          ) : null
        }

        {
          //display skeleton while loading rating
          this.props.rating ? (
            <>
              <StyledRating
                name="customized-color"
                value={this.props.rating.rating}
                getLabelText={(value) =>
                  `${value} Heart${value !== 1 ? 's' : ''}`
                }
                max={10}
                min={1}
                precision={0.1}
                disabled={this.props.username ? false : true}
                icon={<FavoriteIcon fontSize="inherit" />}
                onChange={(event, newValue) => {
                  this.props.submit_rating(newValue)
                }}
              />
              <Typography>
                with {this.props.rating.nr_ratings} {this.props.rating.nr_ratings == 1? "rating": "ratings"} 
              </Typography>
            </>
          ) : (
            <Skeleton animation="wave" />
          )
        }
      </Box>
    )
  }
}
const mapStateToProps = (state, ownProps) => {
  let meme_id = ownProps.meme_id
  return {
    username: state.auth.username,
    meme_id: meme_id,
    rating: state.ratings.overall[meme_id],
    user_rating: state.ratings.cur_user[meme_id],
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    load_rating: () => {
      get_rating(ownProps.meme_id)(dispatch)
    },
    submit_rating: (newValue) => {
      console.log('posting new rating')
      post_rating(ownProps.meme_id, newValue)(dispatch)
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeartRating)
