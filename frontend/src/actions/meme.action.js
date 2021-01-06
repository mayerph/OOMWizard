import * as config from '../config.json'
const destination = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`
/**
 * action to request a certain meme
 * @param {*} id identifier of the meme
 */
const getMeme = (id) => (dispatch) => {
  fetch(`${destination}/memes/${id}`, {
    method: 'GET',
  }).then(async (response) => {
    dispatch({
      type: 'GET_MEME_LOADING',
    })

    try {
      const data = await response.json()
      dispatch({
        type: 'GET_MEME_SUCCESS',
        payload: data,
      })
    } catch (err) {
      dispatch({
        type: 'GET_MEME_ERROR',
      })
    }
  })
}

/**
 * action to request all memes
 */
const getMemes = () => (dispatch) => {
  fetch(`${destination}/memes/`, {
    method: 'GET',
  }).then(async (response) => {
    dispatch({
      type: 'GET_MEMES_LOADING',
    })
    try {
      const data = await response.json()
      dispatch({
        type: 'GET_MEMES_SUCCESS',
        payload: data,
      })
    } catch (err) {
      dispatch({
        type: 'GET_MEMES_ERROR',
      })
    }
  })
}

export { getMeme, getMemes }
