import { Meme } from '../models/meme.model'
const DefaultState = {
  loading: false,
  data: {},
  error: undefined,
}
const memeReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case 'GET_MEME':
      const newState = {
        ...state,
        loading: false,
        data: {
          ...state.data,
          viewedMeme: Meme.fromJSON(action.payload),
        },
      }
      console.log('the new state is', newState)
      return newState
    case 'GET_MEMES':
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          viewedMeme: Meme.fromJSON(action.payload),
        },
      }

    default:
      return state
  }
}

export default memeReducer
