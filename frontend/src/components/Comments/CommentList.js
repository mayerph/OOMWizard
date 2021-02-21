import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Skeleton from '@material-ui/lab/Skeleton'
import TextField from '@material-ui/core/TextField'

import React from 'react'
import { connect } from 'react-redux'
import { load_comments, post_comment } from '../../actions/comment.actions'

class CommentSection extends React.Component {
  post_comment(meme_id, comment) {
    this.props.post_comment(meme_id, comment)
  }

  render_comments() {
    return (
      <>
        {this.props.comments.map((comment, index) => (
          <>
            <Divider variant="inset" component="li" />
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
        {this.props.username?
        (<ListItem>
          <form
            id={`comments-${self.props.meme_id}`}
            noValidate 
            autoComplete='off'
            onKeyPress={this.props.submit_comment()}
            >
            <TextField
              label={`Comment as ${this.props.username}`}
              multiline
              rows={4}
              placeholder={`Press enter to comment here`}
              name="comment"
              variant="outlined"
            />
          </form>
        </ListItem>)

          : null
        }
      </List>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let meme_id = ownProps.meme_id
  let comments = state.comments[meme_id]
  if (!comments) {
    load_comments(meme_id)
  }
  return {
    username: state.auth.username,
    meme_id: meme_id,
    comments: comments,
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  submit_comment: event => {
    if (e.keyCode == 13){
      let formData = new FormData(event.currentTarget)
      post_comment(ownProps.meme_id, formData.get("comment"))(dispatch)
      event.currentTarget.reset()
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentSection)
