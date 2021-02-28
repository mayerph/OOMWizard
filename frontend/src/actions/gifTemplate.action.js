import axios from 'axios'
import * as config from '../config.json'

const destination = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`

const addCaptionToActiveTemplate = (caption) => (dispatch) => {
  dispatch({
    type: 'ADD_CAPTION_TO_GIF',
    payload: caption,
  })
}

const updateFramesOfActiveTemplate = (frames) => (dispatch) => {
  dispatch({
    type: 'UPDATE_FRAMES_ACTIVE_TEMPLATE_GIF',
    payload: frames,
  })
}

const updateCaptions = (captions) => (dispatch) => {
  dispatch({
    type: 'UPDATE_CAPTIONS_GIF',
    payload: captions,
  })
}

const setActiveFrame = (index) => (dispatch) => {
  dispatch({
    type: 'SET_ACTIVE_FRAME_GIF',
    payload: index,
  })
}

const setActiveTemplate = (index) => (dispatch) => {
  dispatch({
    type: 'SET_ACTIVE_TEMPLATE_GIF',
    payload: index,
  })
}
/**
 * action to request all memes
 */

const getGifTemplates = () => (dispatch) => {
  axios.get(`${destination}/gif/templates`).then(async (response) => {
    dispatch({
      type: 'GET_GIF_TEMPLATES_SUCCESS',
      payload: response.data,
    })
  })
}

const generateGifMeme = (meme) => (dispatch) => {
  axios.post(`${destination}/gif/memes`, meme).then(async (response) => {
    dispatch({
      type: 'GENERATE_GIF_MEME',
      payload: response.data,
    })
  })
}

const addNewTemplate = (formData) => (dispatch) => {
  axios
    .post(`${destination}/gif/templates`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    .then(async (response) => {
      dispatch({
        type: 'ADD_NEW_TEMPLATE_GIF',
        payload: response.data,
      })
    })
}

export {
  getGifTemplates,
  addCaptionToActiveTemplate,
  updateFramesOfActiveTemplate,
  updateCaptions,
  setActiveTemplate,
  generateGifMeme,
  addNewTemplate,
  setActiveFrame,
}
