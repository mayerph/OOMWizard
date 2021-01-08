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

/**
 * sends a request to the server to generate meme
 * @param {*} meme object representing a meme image
 */
const generateMeme = (meme) => {
  console.log('the meme is', meme)
  return new Promise((resolve, reject) => {
    fetch(`${destination}/memes/file`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memes: [meme],
      }),
    })
      .then((res) => {
        res.arrayBuffer()
      })
      .then((meme) => {
        console.log('buffer', meme)
        resolve(meme)
        return
      })
      .catch((err) => {
        reject(err)
        return
      })
  })
}

export { getMeme, getMemes, generateMeme }
