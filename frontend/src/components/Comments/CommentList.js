import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Skeleton from '@material-ui/lab/Skeleton'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import SendIcon from '@material-ui/icons/Send'

import React from 'react'
import { connect } from 'react-redux'
import {
  load_comments as get_comments,
  post_comment,
} from '../../actions/comment.actions'

const commentStyle = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}))

class CommentSection extends React.Component {
  post_comment(meme_id, comment) {
    this.props.post_comment(meme_id, comment)
  }

  render_comments() {
    return (
      <>
        {this.props.comments.map((comment, index) => (
          <>
            <Divider component="li" />
            <ListItem>
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

  render() {
    if (!this.props.comments) {
      this.props.load_comments()
    }
    return (
      <List>
        {this.props.comments ? (
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
        {this.props.username ? (
          <ListItem>
            <form
              style={{ width: '100%' }}
              id={`comments-${this.props.meme_id}`}
              noValidate
              autoComplete="off"
            >
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
                variant="contained"
                color="primary"
                onClick={this.props.submit_comment}
              >
                <SendIcon />
              </Button>
            </form>
          </ListItem>
        ) : (
          <ListItem>
            <ListItemText primary="Login to comment ;)" />
          </ListItem>
        )}
      </List>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let meme_id = ownProps.meme_id
  let comments = state.comments[meme_id]
  return {
    username: state.auth.username,
    meme_id: meme_id,
    comments: comments,
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    load_comments: () => {
      get_comments(ownProps.meme_id)(dispatch)
    },
    submit_comment: (event) => {
      let formData = new FormData(event.currentTarget.form)
      post_comment(ownProps.meme_id, formData.get('comment'))(dispatch)
      event.currentTarget.form.reset()
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentSection)
