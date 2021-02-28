import React, {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useState,
  useLayoutEffect,
} from 'react'
import { connect } from 'react-redux'

import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Dialog from '@material-ui/core/Dialog'
import AddIcon from '@material-ui/icons/Add'
import { CloudQueue, LaptopMac, Group } from '@material-ui/icons'
import LinkIcon from '@material-ui/icons/Link'
import { Snackbar } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import MuiDialogContent from '@material-ui/core/DialogContent'
import './downloadDialog.style.css'
import * as config from '../../config.json'
import { generateMeme } from '../../actions/meme.action'

/**
 * Dialog component for initiating a meme download
 */
const DownloadDialog = (props) => {
  const [openedSnack, setOpenedSnack] = useState(false)
  const changedToOpen = useRef(false)
  const urlRef = useRef(undefined)

  /**
   * gets called everytime the open property get changed.
   * if the dialog gets opened changedToOpen gets set to true.
   * if its true, the javascript controlled scroll up is initiated.
   * For this see downloadLinksRef
   */
  useEffect(() => {
    if (props.open) {
      changedToOpen.current = true
    }
  }, [props.open])

  /**
   * Reference to the .social-list-wrapper dom element
   * scrolls up so the list starts with the first element
   */
  const downloadLinksRef = useCallback((node) => {
    if (node && node != '' && changedToOpen.current) {
      node.scrollTop = 0
      changedToOpen.current = false
    }
  }, [])

  /**
   * general style settings
   */
  const styles = (theme) => ({
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
  const DialogTitle = withStyles(styles)((props) => {
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
  const DialogFooter = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiDialogContent)

  /**
   * wrapper element for setting a divider
   */
  const DialogDivider = withStyles((theme) => ({
    root: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      paddingLeft: 0,
      paddingRight: 0,
    },
  }))(MuiDialogContent)

  /**
   * opens snackbar which indicates that the url has been copied
   */
  const openSnackbar = () => {
    if (urlRef.current) {
      urlRef.current.select()
    }

    document.execCommand('copy')
    setOpenedSnack(true)
  }

  /**
   * closes the snackbar which indicates that the url has been copied
   */
  const closeSnackbar = () => {
    setOpenedSnack(false)
  }

  /**
   * location of the sharedable memes
   */
  const proxySetting = `${config.frontend.proxy.protocol}://${config.frontend.proxy.server}:${config.frontend.proxy.port}/`
  const frontendSetting = `${config.frontend.protocol}://${config.frontend.server}:${config.frontend.port}/`

  const destination = config.frontend.proxy.enabled
    ? proxySetting
    : frontendSetting

  const serverSideGeneration = (meme) => {
    generateMeme(meme).then((data) => {
    })
  }

  /**
   * meme which should be shared
   */
  const meme =
    props.meme && props.meme.id
      ? props.meme
      : {
          id: '5ff46e6a4b03de6df1d420c5',
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


  const { open, onClose } = props

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={openedSnack}
        autoHideDuration={3000}
        onClose={() => closeSnackbar()}
        message="Link copied to clipboard"
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => closeSnackbar()}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <Dialog
        className="download-dialog"
        onClose={onClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogTitle id="custom-dialog-title" onClose={onClose}>
          Share
        </DialogTitle>
        <DialogDivider className="dialog-content" dividers>
          <div className="download-list-wrapper" ref={downloadLinksRef}>
            <List className="download-list">
              <ListItem
                autoFocus
                button
                onClick={() => serverSideGeneration(meme)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <CloudQueue />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="server-side generation" />
              </ListItem>
              <ListItem autoFocus button onClick={() => openSnackbar()}>
                <ListItemAvatar>
                  <Avatar>
                    <LaptopMac />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="client-side generation" />
              </ListItem>
              <ListItem autoFocus button onClick={() => openSnackbar()}>
                <ListItemAvatar>
                  <Avatar>
                    <Group />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="third-party generation" />
              </ListItem>
            </List>
          </div>
        </DialogDivider>
        <DialogFooter className="dialog-footer">
          Choose a download option. This determines where the meme will be
          generated.
        </DialogFooter>
      </Dialog>
    </>
  )
}

export default connect()(DownloadDialog)
