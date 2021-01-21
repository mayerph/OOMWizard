const INITIAL_STATE = {
  username: false,
  auth_err_msg: '',
  prompt: false,
}

const auth = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      console.log('Welcome user:', action.payload.username)
      var new_state = {
        ...state,
        prompt: false,
        username: action.payload.username,
      }
      return new_state
    case 'AUTH_FAILURE':
      return {
        ...state,
        username: action.payload.username,
        auth_err_msg: action.payload.auth_err_msg,
      }
    case 'OPEN_PROMPT':
      var new_state = {
        ...state,
        prompt: true,
      }
      return new_state
    case 'CLOSE_PROMPT':
      var new_state = {
        ...state,
        prompt: false,
      }
      return new_state
    default:
      return { ...state }
  }
}

export default auth
