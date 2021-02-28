import React from 'react'
import { connect } from 'react-redux'

import {
  List,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  Divider,
} from '@material-ui/core'
import { Redirect } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import AddBoxIcon from '@material-ui/icons/AddBox'
import BuildIcon from '@material-ui/icons/Build'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogTitle from '@material-ui/core/DialogTitle'

class EditMemeDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = { redirect: false }
  }

  redirect(url, wipe) {
    const element = {
      x: 0,
      y: 0,
      width: 400,
      bounds: '#meme-canvas',
      type: 'image',
      imageUrl: url,
    }
    if (wipe) {
      this.props.dispatch({ type: 'REMOVE_ALL_ELEMENTS' })
    }

    this.props.dispatch({ type: 'ADD_ELEMENT', element: element })
    this.setState({ redirect: true })
  }

  render() {
    const meme = this.props.meme_data
    return (
      <>
        {this.state.redirect ? (
          <Redirect
            to={{
              pathname: '/imagememe',
            }}
          />
        ) : (
          <Dialog
            className="download-dialog"
            onClose={() => this.props.onClose()}
            aria-labelledby="simple-dialog-title"
            open={this.props.open}
            fullWidth={true}
            maxWidth="xs"
          >
            <DialogTitle>Add to/create meme editor</DialogTitle>
            <Divider />
            <List>
              <ListItem
                autoFocus
                button
                onClick={() => this.redirect(meme.url, true)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <BuildIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Start from scratch" />
              </ListItem>
              <ListItem
                autoFocus
                button
                onClick={() => this.redirect(meme.url, false)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <AddBoxIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Add image" />
              </ListItem>
            </List>
            <Divider />
            <MuiDialogContent>
              Choose whether to add the image to the current editor or to
              replace the current editor content.
            </MuiDialogContent>
          </Dialog>
        )}
      </>
    )
  }
}

const mapStateToProps = (state, ownProps) => {}

const mapDispatchToProps = (dispatch) => {}

export default connect()(EditMemeDialog)
