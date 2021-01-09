import { TextField } from '@material-ui/core'
import { Button } from '@material-ui/core'

import React from 'react'
import { connect } from 'react-redux'

import { signIn, signUp } from '../../actions/auth.actions'

class AuthForm extends React.Component {
  signIn() {
    this.props.signIn(document.getElementById('auth-form'))
  }
  signUp() {
    this.props.signUp(document.getElementById('auth-form'))
  }
  render() {
    console.log('render')
    if (this.props.username) {
      return <div> {this.props.username}@MemeWizard</div>
    }
    var error = this.props.error_msg ? true : false
    return (
      <form id="auth-form" method="POST">
        <TextField
          name="username"
          label="Username"
          error={error}
          helperText={error ? this.props.error_msg : ''}
        />
        <TextField
          type="password"
          name="password"
          label="Password"
          error={error}
        />
        <Button onClick={this.signIn.bind(this)}> sign in </Button>{' '}
        <Button onClick={this.signUp.bind(this)}> sign up </Button>{' '}
        <div>{error}</div>
      </form>
    )
  }
}

const mapStateToProps = (state) => {
  console.log(state)
  return {
    username: state.auth.username,
    error_msg: state.auth.auth_err_msg,
  }
}

export default connect(mapStateToProps, {
  signIn,
  signUp,
})(AuthForm)
