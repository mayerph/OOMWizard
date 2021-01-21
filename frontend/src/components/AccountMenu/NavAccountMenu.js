import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'

import React from 'react'
import { connect } from 'react-redux'

import {
  account_menu_open,
  account_menu_close,
} from '../../actions/nav.actions'
import { open_prompt } from '../../actions/auth.actions'

class NavAccountMenu extends React.Component {
  renderItemsLoggedOut() {
    return (
      <>
        <MenuItem onClick={this.show_login_prompt.bind(this)}>
          SignUp/SignIn
        </MenuItem>
      </>
    )
  }
  renderItemsLoggedIn() {
    return (
      <>
        <MenuItem onClick={this.closeMenu.bind(this)}>
          Hello {this.props.username}!
        </MenuItem>
        <MenuItem>Logout</MenuItem>
      </>
    )
  }
  show_login_prompt() {
    this.closeMenu()
    this.props.open_prompt()
  }

  closeMenu() {
    this.props.account_menu_close()
  }

  openMenu() {
    this.props.account_menu_open()
  }

  render() {
    return (
      <>
        <IconButton
          id="account-menu-button"
          aria-label="account of current user"
          aria-controls="account-menu-button"
          aria-haspopup="true"
          color="inherit"
          onClick={this.openMenu.bind(this)}
        >
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={document.getElementById('account-menu-button')}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id="account-menu"
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={this.props.menu_open}
          onClose={this.closeMenu.bind(this)}
        >
          <div>
            {this.props.logged_in
              ? this.renderItemsLoggedIn()
              : this.renderItemsLoggedOut()}
          </div>
        </Menu>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    logged_in: state.auth.username != false,
    username: state.auth.username,
    menu_open: state.nav.user_menu_open,
  }
}
export default connect(mapStateToProps, {
  account_menu_close,
  account_menu_open,
  open_prompt,
})(NavAccountMenu)
