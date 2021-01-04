import React from 'react'
import { connect } from 'react-redux'

import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Dialog from '@material-ui/core/Dialog'
import AddIcon from '@material-ui/icons/Add'
import LinkIcon from '@material-ui/icons/Link'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  EmailIcon,
  FacebookIcon,
  WhatsappIcon,
  RedditIcon,
  TwitterIcon,
} from 'react-share'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import MuiDialogContent from '@material-ui/core/DialogContent'
import './shareDialog.style.css'
import * as config from '../../config.json'

/**
 * Dialog component for initiating the share of a meme
 */
class ShareDialog extends React.Component {
  /**
   * general style settings
   */
  styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  })

  /**
   * Dialog-title inclusive close button
   */
  dialogTitle = withStyles(this.styles)((props) => {
    const { children, classes, onClose, ...other } = props
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
    )
  })

  /**
   * Dialog footer inclusive style
   */
  dialogFooter = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiDialogContent)

  /**
   * wrapper element for setting a divider
   */
  dividerWrapper = withStyles((theme) => ({
    root: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      paddingLeft: 0,
      paddingRight: 0,
    },
  }))(MuiDialogContent)

  /**
   * List consting of all offered social media platforms
   */
  platforms = [
    {
      name: 'WhatsApp',
      source: 'https://api.whatsapp.com/send?text=',
      icon: <WhatsappIcon />,
    },
    {
      name: 'Reddit',
      source: 'http://www.reddit.com/submit?url=',
      icon: <RedditIcon />,
    },
    {
      name: 'Facebook',
      source: 'https://www.facebook.com/sharer/sharer.php?u=',
      icon: <FacebookIcon />,
    },
    {
      name: 'Twitter',
      source: 'https://api.whatsapp.com/send?text=',
      icon: <TwitterIcon />,
    },
    { name: 'E-Mail', source: 'mailto:?body=', icon: <EmailIcon /> },
  ]

  render() {
    const DialogTitle = this.dialogTitle
    const DividerWrapper = this.dividerWrapper
    const DialogFooter = this.dialogFooter

    const proxySetting = `${config.frontend.proxy.protocol}://${config.frontend.proxy.server}:${config.frontend.proxy.port}/`
    const frontendSetting = `${config.frontend.protocol}://${config.frontend.server}:${config.frontend.port}/`

    const destination = config.frontend.proxy.enabled
      ? proxySetting
      : frontendSetting
    const meme = this.props.meme

    const { open, onClose } = this.props
    const handleListItemClick = (value) => {
      onClose(value)
    }

    const handleClose = () => {
      onClose()
    }
    console.log(meme)

    return (
      <Dialog
        className="social-dialog"
        onClose={onClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogTitle id="custom-dialog-title" onClose={onClose}>
          Share
        </DialogTitle>
        <DividerWrapper dividers>
          <List className="social-list">
            {this.platforms.map((platform) => (
              <a
                className="social-link"
                href={platform.source + destination + 'meme/' + meme.id}
                target="_blank"
                rel="noreferrer"
                key=""
              >
                <ListItem key={platform.name}>
                  <ListItemAvatar>
                    <Avatar>{platform.icon}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={platform.name} />
                </ListItem>
              </a>
            ))}
            <ListItem
              autoFocus
              button
              onClick={() => handleListItemClick('addAccount')}
            >
              <ListItemAvatar>
                <Avatar>
                  <LinkIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Link kopieren" />
            </ListItem>
          </List>
        </DividerWrapper>
        <DialogFooter className="dialog-footer">
          Choose a share option. The link will open the platform in a new tab.
        </DialogFooter>
      </Dialog>
    )
  }
}

ShareDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
}
ShareDialog.defaultProps = {}

export default connect()(ShareDialog)
