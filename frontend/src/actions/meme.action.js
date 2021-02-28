import * as config from '../config.json'
import * as download from 'downloadjs'

const destination = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`
/**
 * action to request a certain meme
 * @param {*} id identifier of the meme
 */
const getMeme = (id) => (dispatch) => {
  fetch(`${destination}/memes/${id}`, {
    method: 'GET',
    credentials: 'include',
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
    credentials: 'include',
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
  return new Promise(async (resolve, reject) => {
    console.log({ template: meme.template, captions: meme.captions })
    fetch(`${destination}/memes/file`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Filename: '' },
      credentials: 'include',
      body: JSON.stringify({
        memes: [{ template: meme.template, captions: meme.captions }],
      }),
    })
      .then(async (res) => {
        const filename = res.headers.get('filename')
        const mimeType = res.headers.get('content-type')
        const meme = await res.blob()
        console.log(meme)
        download(meme, filename, mimeType)
        resolve('meme')
        return
      })
      .catch((err) => {
        reject(err)
        return
      })
  })
}

export { getMeme, getMemes, generateMeme }
