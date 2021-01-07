import React, { forwardRef } from 'react'
import { connect } from 'react-redux'

import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Dialog from '@material-ui/core/Dialog'
import AddIcon from '@material-ui/icons/Add'
import LinkIcon from '@material-ui/icons/Link'
import { Snackbar } from '@material-ui/core'
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
  constructor(props) {
    super(props)
    this.state = {
      copySnackbar: false,
    }
  }
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
  dialogDivider = withStyles((theme) => ({
    root: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      paddingLeft: 0,
      paddingRight: 0,
    },
  }))(MuiDialogContent)

  componentDidMount() {
    console.log('hellooooooo')
  }
  /**
   * gets called so the list can gets scrolled through from the top
   * @param {*} ref dom reference of the social media list
   */
  initializeScrollTop(ref) {
    console.log('initializeScrollTop')
    if (ref && ref.scrollTop) {
      // ref.scrollTop = 0
    }
  }

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

  openSnackbar() {
    console.log('openSnackbar')
    this.setState({ ...this.state, copySnackbar: true })
  }

  closeSnackbar() {
    console.log('closeSnackbar')
    this.setState({ ...this.state, copySnackbar: false })
  }

  setRef() {}

  componentDidMount() {
    console.log('componentDidMount')
  }

  /**
   * renders the component
   */
  render() {
    const DialogTitle = this.dialogTitle
    const DialogDivider = this.dialogDivider
    const DialogFooter = this.dialogFooter

    const proxySetting = `${config.frontend.proxy.protocol}://${config.frontend.proxy.server}:${config.frontend.proxy.port}/`
    const frontendSetting = `${config.frontend.protocol}://${config.frontend.server}:${config.frontend.port}/`

    const destination = config.frontend.proxy.enabled
      ? proxySetting
      : frontendSetting
    const meme = this.props.meme
      ? this.props.meme
      : {
          name: '06220ac0-4e95-11eb-b7d3-334230f5957c.png',
          route: '/images/memes/06220ac0-4e95-11eb-b7d3-334230f5957c.png',
          template: {
            id: '5ff1df51a28fb193a50f1c60',
            name: 'Drake-Hotline-Bling.jpg',
            route: '/templates/Drake-Hotline-Bling.jpg',
          },
          captions: [
            {
              text: 'hello world',
              position: {
                x: 0,
                y: 0,
              },
              color: 'green',
              size: 60,
            },
          ],
        }

    const { open, onClose } = this.props

    const handleClose = () => {
      onClose()
    }

    return (
      <>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.testen}
          autoHideDuration={3000}
          onClose={() => this.closeSnackbar()}
          message="Note archived"
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => this.closeSnackbar()}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
        <Dialog
          className="social-dialog"
          onClose={handleClose}
          aria-labelledby="simple-dialog-title"
          open={open}
          fullWidth={true}
          maxWidth="xs"
        >
          <DialogTitle id="custom-dialog-title" onClose={handleClose}>
            Share
          </DialogTitle>
          <DialogDivider className="dialog-content" dividers>
            <div
              className="social-list-wrapper"
              ref={(ref) => this.initializeScrollTop(ref)}
            >
              <List className="social-list">
                {this.platforms.map((platform) => (
                  <a
                    className="social-link"
                    href={platform.source + destination + 'meme/' + meme.id}
                    target="_blank"
                    rel="noreferrer"
                    key={'link' + platform.name}
                  >
                    <ListItem key={platform.name}>
                      <ListItemAvatar>
                        <Avatar>{platform.icon}</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={platform.name} />
                    </ListItem>
                  </a>
                ))}
                <ListItem autoFocus button onClick={() => this.openSnackbar()}>
                  <ListItemAvatar>
                    <Avatar>
                      <LinkIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Link kopieren" />
                </ListItem>
              </List>
            </div>
          </DialogDivider>
          <DialogFooter className="dialog-footer">
            Choose a share option. The link will open the platform in a new tab.
          </DialogFooter>
        </Dialog>
      </>
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
