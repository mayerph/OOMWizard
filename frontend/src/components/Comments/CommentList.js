import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Skeleton from '@material-ui/lab/Skeleton'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import SendIcon from '@material-ui/icons/Send'
import RefreshIcon from '@material-ui/icons/Refresh'

import { Box, Typography } from '@material-ui/core'

import React from 'react'
import { connect } from 'react-redux'

import * as config from '../../config.json'
const backend_uri = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`

class CommentSection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      comments: undefined,
    }
  }

  componentDidMount() {
    this.load_comments()
  }

  load_comments() {
    let url =
      `${backend_uri}/comments?` +
      new URLSearchParams({
        identifier: this.props.identifier,
      })

    fetch(url, {
      method: 'GET',
    }).then(async (res) => {
      if (res.ok) {
        let json = await res.json()
        this.setState({ comments: json.comments })
      }
    })
  }

  post_comment(comment) {
    let formData = new FormData()
    formData.set('identifier', this.props.identifier)
    formData.set('comment', comment)
    let url = `${backend_uri}/comments`

    fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }).then(async (res) => {
      if (res.ok) {
        let json = await res.json()
        this.setState({ comments: json.comments })
      }
    })
  }

  render_comments() {
    return (
      <>
        {this.state.comments.map((comment, index) => (
          <>
            <Divider component="li" />
            <ListItem style={{ width: '100%' }}>
              <ListItemText
                primary={`${comment.username} - ${comment.timestamp}`}
                secondary={comment.comment}
              />
            </ListItem>
          </>
        ))}
      </>
    )
  }
  render_comment_form() {
    return (
      <>
        <form style={{ width: '100%' }} noValidate autoComplete="off">
          <TextField
            fullWidth
            label={`Comment as ${this.props.username}`}
            multiline
            rows={4}
            placeholder={`Press enter to comment here`}
            name="comment"
            variant="outlined"
          />
          <Button
            style={{ marginTop: '2px' }}
            variant="contained"
            color="primary"
            onClick={(event) => {
              let form = new FormData(event.currentTarget.form)
              this.post_comment(form.get('comment'))
              event.currentTarget.form.reset()
            }}
          >
            <SendIcon />
          </Button>
        </form>
      </>
    )
  }

  render() {
    return (
      <>
        {/** refesh button */}
        <Box component="span" m={1}>
          <Button onClick={() => this.load_comments()}>
            <RefreshIcon fontSize="small" />
          </Button>
        </Box>
        <Divider></Divider>
        <List style={{ width: '100%' }}>
          {this.state.comments ? (
            this.render_comments()
          ) : (
            // display some placeholder skeleton while comments are being loaded
            <>
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
            </>
          )}
          <Divider />
          <ListItem style={{ width: '100%' }}>
            {this.props.username ? (
              this.render_comment_form()
            ) : (
              <Typography> Login to comment :)</Typography>
            )}
          </ListItem>
        </List>
        <div></div>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentSection)
