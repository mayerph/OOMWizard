import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Rating from '@material-ui/lab/Rating'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import FavoriteIcon from '@material-ui/icons/Favorite'
import Skeleton from '@material-ui/lab/Skeleton'
import { load_meta, post_rating } from '../../actions/meta.actions'

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
    if (!this.props.meta || (this.props.username && !this.props.meta_user)) {
      this.props.load_data(this.props.identifier)
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
          this.props.username && this.props.meta_user ? (
            <Typography>
              Your rating: {this.props.meta_user.rating}/10
            </Typography>
          ) : null
        }

        {
          //display skeleton while loading rating
          this.props.meta ? (
            <>
              <StyledRating
                name="customized-color"
                value={this.props.meta.avg_rating}
                getLabelText={(value) =>
                  `${value} Heart${value !== 1 ? 's' : ''}`
                }
                max={10}
                min={1}
                precision={0.1}
                readOnly={this.props.username ? false : true}
                icon={<FavoriteIcon fontSize="inherit" />}
                onChange={(event, newValue) => {
                  this.props.submit_rating(this.props.identifier, newValue)
                }}
              />
              <Typography>
                with {this.props.meta.nr_ratings}{' '}
                {this.props.meta.nr_ratings == 1 ? 'rating' : 'ratings'}
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
  let identifier = ownProps.identifier
  return {
    username: state.auth.username,
    identifier: identifier,
    meta: state.meta.info[identifier],
    meta_user: state.meta.user[identifier],
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    load_data: (identifier) => load_meta(identifier)(dispatch),
    submit_rating: (identifier, newValue) =>
      post_rating(identifier, newValue)(dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeartRating)
