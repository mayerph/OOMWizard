import { Meme } from '../models/meme.model'

/**
 * the loading property indicates the waiting for reponse
 * the data property contains the data relevant for the app
 * the error property indicates if an error occured during performing a certain action
 */
const DefaultState = {
  loading: false,
  data: {},
  error: undefined,
}

/**
 * reducer for a list of all memes
 * @param {*} state the current state of the of the meme list
 * @param {*} action contains the action type and the new data which overrides the current state
 */
const memeListReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case 'GET_MEMES_SUCCESS':
      const newState = {
        ...state,
        loading: false,
        data: {
          ...state.data,
          viewedMeme: Meme.fromJSON(action.payload),
        },
      }

      return newState
    case 'GET_MEMES_ERROR':
      return {
        ...state,
        loading: false,
        error: 'unable to get a meme',
      }

    case 'GET_MEMES_LOADING':
      return {
        ...state,
        loading: true,
        error: undefined,
      }

    default:
      return state
  }
}

export default memeListReducer
