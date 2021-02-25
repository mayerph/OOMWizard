const INITIAL_STATE = {
  info: {},
  user: {},
}

const ratings = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'LOGGED_OUT':
      return {
        info: state.info,
        user: {},
      }
    case 'UPDATE_META_INFO':
      let data = action.payload
      let new_state = {
        info: {...state.info},
        user: {...state.user},
      }
      new_state.info[data.identifier] = data.meta_info
      new_state.user[data.identifier] = data.user_meta
      return new_state
    default:
      return state
  }
}
export default ratings
