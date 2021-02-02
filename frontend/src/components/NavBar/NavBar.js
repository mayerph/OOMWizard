import React from 'react'
import './NavBar.css'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import { connect } from 'react-redux'

import NavAccountMenu from '../AccountMenu'
import { AuthDialog } from '../Auth'

class NavBar extends React.Component {
  canvasElementCounter = 0
  handleAddElement(type) {
    const element = {
      x: Math.floor(Math.random() * 200),
      y: Math.floor(Math.random() * 200),
      width: Math.floor(Math.random() * 200) + 50,
      height: Math.floor(Math.random() * 200) + 50,
      bounds: '#meme-canvas',
      id: this.canvasElementCounter++,
      type: type,
      imageUrl: process.env.PUBLIC_URL + '/smug_goat.jpg',
    }
    this.props.dispatch({ type: 'ADD_ELEMENT', element: element })
  }

  render() {
    return (
      <div className="navbar-container">
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={() => this.handleAddElement('image')}
            >
              Image
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={() => this.handleAddElement('text')}
            >
              Text
            </Button>
            <Typography variant="h6" className="navbar-container-title">
              MemeWizard
            </Typography>
            <div>
              <NavAccountMenu />
            </div>
          </Toolbar>
        </AppBar>
        <AuthDialog />
      </div>
    )
  }
}

NavBar.propTypes = {}
NavBar.defaultProps = {}

export default connect()(NavBar)
