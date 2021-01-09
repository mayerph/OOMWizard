const INITIAL_STATE = {
  username: false,
  auth_err_msg: '',
}

const authenticator = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      return {
        ...state,
        ...INITIAL_STATE,
        username: action.payload.username,
      }
    case 'AUTH_FAILURE':
      return {
        ...state,
        ...INITIAL_STATE,
        username: action.payload.username,
        auth_err_msg : action.payload.auth_err_msg,
      }
    default:
      return { ...state, ...INITIAL_STATE }
  }
}

export default authenticator
