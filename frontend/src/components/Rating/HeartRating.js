import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Rating from '@material-ui/lab/Rating'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import FavoriteIcon from '@material-ui/icons/Favorite'
import Skeleton from '@material-ui/lab/Skeleton'

import * as config from '../../config.json'
const backend_uri = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating)

class HeartRating extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      meta: undefined,
      meta_user: undefined,
    }
  }

  componentDidMount() {
    fetch(`${backend_uri}/meta/${this.props.identifier}`, {
      method: 'GET',
      credentials: 'include',
    }).then(async (res) => {
      if (res.ok) {
        let json = await res.json()
        this.setState({
          meta: json.meta_info,
          meta_user: json.user_meta,
        })
      }
    })
  }

  post_rating(rating) {
    let formData = new FormData()
    formData.set('identifier', this.props.identifier)
    formData.set('rating', rating)
    let url = `${backend_uri}/meta/rate`

    fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }).then(async (res) => {
      if (res.ok) {
        let json = await res.json()
        this.setState({
          meta: json.meta_info,
          meta_user: json.user_meta,
        })
      } else {
        console.log(
          `Response to post ratings failed with ${res.status}:${res.statusText}.`,
        )
      }
    })
  }

  render() {
    return (
      <Box
        style={{ textAlign: 'center' }}
        component="fieldset"
        mb={3}
        borderColor="transparent"
      >
        {
          // only display user rating if present
          this.props.username && this.state.meta_user ? (
            <Typography>
              Your rating: {this.state.meta_user.rating}/10
            </Typography>
          ) : null
        }

        {
          //display skeleton while loading rating
          this.state.meta ? (
            <>
              <StyledRating
                name="customized-color"
                value={this.state.meta.avg_rating}
                getLabelText={(value) =>
                  `${value} Heart${value !== 1 ? 's' : ''}`
                }
                max={10}
                min={1}
                precision={0.1}
                readOnly={this.props.username ? false : true}
                icon={<FavoriteIcon fontSize="inherit" />}
                onChange={(event, newValue) => {
                  this.post_rating(newValue)
                }}
              />
              <Typography>
                with {this.state.meta.nr_ratings}{' '}
                {this.state.meta.nr_ratings == 1 ? 'rating' : 'ratings'}
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
  return {
    username: state.auth.username,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(HeartRating)
