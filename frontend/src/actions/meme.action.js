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
    const data = await response.json()
    dispatch({
      type: 'GET_MEME',
      payload: data,
    })
  })
}

/**
 * action to request all memes
 */
const getMemes = () => (dispatch) => {
  fetch(`${destination}/memes/`, {
    method: 'GET',
  }).then(async (response) => {
    const data = await response.json()
    dispatch({
      type: 'GET_MEMES',
      payload: data,
    })
  })
}

export { getMeme, getMemes }
