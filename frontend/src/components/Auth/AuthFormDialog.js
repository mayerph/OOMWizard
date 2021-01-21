import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import React from 'react'
import { connect } from 'react-redux'
import {
  signIn,
  signUp,
  open_prompt,
  close_prompt,
} from '../../actions/auth.actions'

class AuthDialog extends React.Component {
  signIn() {
    this.props.signIn(document.getElementById('auth-form'))
  }
  signUp() {
    this.props.signUp(document.getElementById('auth-form'))
  }
  close_prompt() {
    this.props.close_prompt()
  }

  render() {
    return (
      <Dialog
        open={this.props.prompting}
        onClose={this.close_prompt.bind(this)}
        aria-labelledby="login-form-title"
      >
        <DialogTitle id="login-form-title">Sign In/Up</DialogTitle>
        <DialogContent>
          <DialogContentText>Please use a strong password.</DialogContentText>
          <form id="auth-form" method="POST">
            <TextField
              name="username"
              label="Username"
              error={this.props.error}
              helperText={this.props.error ? this.props.error_msg : ''}
            />
            <TextField
              type="password"
              name="password"
              label="Password"
              error={this.props.error}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.signIn.bind(this)} color="primary">
            SignIn
          </Button>
          <Button onClick={this.signUp.bind(this)} color="primary">
            SignUp
          </Button>
          <Button onClick={this.close_prompt.bind(this)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  var error = state.auth.auth_err_msg != null && state.auth.auth_err_msg !== ''
  return {
    username: state.auth.username,
    error_msg: state.auth.auth_err_msg,
    prompting: state.auth.prompt,
    error: error,
  }
}

export default connect(mapStateToProps, {
  signIn,
  signUp,
  open_prompt,
  close_prompt,
})(AuthDialog)
