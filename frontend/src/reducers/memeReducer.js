import { Meme } from '../models/meme.model'
const DefaultState = {
  loading: false,
  data: {},
  error: undefined,
}
const memeReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case 'GET_MEME_SUCCESS':
      const newState = {
        ...state,
        loading: false,
        data: {
          ...state.data,
          viewedMeme: Meme.fromJSON(action.payload),
        },
      }

      return newState
    default:
      return state
  }
}

export default memeReducer
