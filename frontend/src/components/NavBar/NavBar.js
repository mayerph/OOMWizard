import React from 'react'
import './NavBar.css'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import { connect } from 'react-redux'

import NavAccountMenu from '../AccountMenu'
import { AuthDialog } from '../Auth'
import { Link } from 'react-router-dom'

class NavBar extends React.Component {
  render() {
    return (
      <div className="navbar-container">
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" className="navbar-container-title">
              <Link
                style={{ color: 'white', textDecoration: 'none' }}
                to={{ pathname: '/' }}
              >
                MemeWizard
              </Link>
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
