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

import { withStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import AddBoxIcon from '@material-ui/icons/AddBox'
import BuildIcon from '@material-ui/icons/Build'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogTitle from '@material-ui/core/DialogTitle'

class EditMemeDialog extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const meme = this.props.meme_data
    return (
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
          <ListItem autoFocus button onClick={() => alert('replacing')}>
            <ListItemAvatar>
              <Avatar>
                <BuildIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Start from scratch" />
          </ListItem>
          <ListItem autoFocus button onClick={() => alert('adding')}>
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
          Choose whether to add the image to the current editor or to replace
          the current editor content.
        </MuiDialogContent>
      </Dialog>
    )
  }
}

const mapStateToProps = (state, ownProps) => {}

const mapDispatchToProps = (dispatch) => {}

export default connect()(EditMemeDialog)
