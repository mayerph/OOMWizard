import * as config from '../config.json'

const backend_uri = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`

function authenticate(dispatch, form, new_user) {
  var formData = new FormData(form)
  var username = formData.get('username')
  var url = new_user
    ? `${backend_uri}/auth/signUp`
    : `${backend_uri}/auth/signIn`
  fetch(url, {
    method: 'POST',
    body: formData,
  }).then(
    async (res) => {
      if (res.ok) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            username: username,
          },
        })
      } else {
        var msg = await res.text()
        dispatch({
          type: 'AUTH_FAILURE',
          payload: {
            auth_err_msg: msg,
          },
        })
      }
    },
    (reason) => console.log(reason),
  )
}

export const signIn = (form) => (dispatch) => {
  var formData = new FormData(form)
  var username = formData.get('username')
  fetch(`${backend_uri}/auth/signIn`, { method: 'POST', body: formData }).then(
    async (res) => {
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
    },
  )
}

export const signUp = (form) => (dispatch) => {
  var formData = new FormData(form)
  var username = formData.get('username')
  fetch(`${backend_uri}/auth/signUp`, { method: 'POST', body: formData }).then(
    async (res) => {
      if (res.ok) {
        dispatch({ type: 'AUTH_SUCCESS', payload: { username: username } })
      } else {
        var msg = await res.text()
        dispatch({ type: 'AUTH_FAILURE', payload: { auth_err_msg: msg } })
      }
    },
    (err_reason) => console.log(err_reason),
  )
}
