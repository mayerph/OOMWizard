const INITIAL_STATE = {}

const comments = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_COMMENTS':
      let new_state = { ...state }
      new_state[action.payload.meme_id] = action.payload.comments
      return new_state
    default:
      return { ...state }
  }
}
export default comments
