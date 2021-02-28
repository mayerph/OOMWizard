import * as config from '../config.json'
//import Cookie from 'react-native-cookie'

const backend_uri = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`

export const open_prompt = () => (dispatch) => {
  dispatch({ type: 'OPEN_PROMPT' })
}

export const close_prompt = () => (dispatch) => {
  dispatch({ type: 'CLOSE_PROMPT' })
}

export const logout = () => (dispatch) => {
  fetch(`${backend_uri}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  }).then(
    async (res) => dispatch({ type: 'LOGGED_OUT' }),
    async (error) => dispatch({ type: 'LOGGED_OUT' }),
  )
}

export const signIn = (form) => (dispatch) => {
  var formData = new FormData(form)
  var username = formData.get('username')
  fetch(`${backend_uri}/auth/signIn`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  }).then(async (res) => {
    var action
    if (res.ok) {
      action = { type: 'AUTH_SUCCESS', payload: { username: username } }
    } else {
      action = {
        type: 'AUTH_FAILURE',
        payload: { auth_err_msg: await res.text() },
      }
    }
    dispatch(action)
  })
}

export const signUp = (form) => (dispatch) => {
  var formData = new FormData(form)
  var username = formData.get('username')
  fetch(`${backend_uri}/auth/signUp`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  }).then(
    async (res) => {
      if (res.ok) {
        dispatch({ type: 'AUTH_SUCCESS', payload: { username: username } })
      } else {
        var msg = await res.text()
        dispatch({ type: 'AUTH_FAILURE', payload: { auth_err_msg: msg } })
      }
    },
    (err_reason) =>
      dispatch({
        type: 'AUTH_FAILURE',
        payload: { auth_err_msg: error_reason },
      }),
  )
}
