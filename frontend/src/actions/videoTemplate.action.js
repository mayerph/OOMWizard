import axios from 'axios'
import * as config from '../config.json'

const destination = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`

const addCaptionToActiveTemplate = (caption) => (dispatch) => {
  dispatch({
    type: 'ADD_CAPTION_TO_VIDEO',
    payload: caption,
  })
}

const updateFramesOfActiveTemplate = (frames) => (dispatch) => {
  dispatch({
    type: 'UPDATE_FRAMES_ACTIVE_TEMPLATE',
    payload: frames,
  })
}

const updateCaptions = (captions) => (dispatch) => {
  dispatch({
    type: 'UPDATE_CAPTIONS',
    payload: captions,
  })
}

const setActiveTemplate = (index) => (dispatch) => {
  dispatch({
    type: 'SET_ACTIVE_TEMPLATE',
    payload: index,
  })
}
/**
 * action to request all memes
 */
const getVideoTemplates = () => (dispatch) => {
  fetch(`${destination}/video/templates`, {
    method: 'GET',
    credentials: 'include',
  }).then(async (response) => {
    dispatch({
      type: 'GET_VIDEO_TEMPLATES_LOADING',
    })
    try {
      const data = await response.json()

      dispatch({
        type: 'GET_VIDEO_TEMPLATES_SUCCESS',
        payload: data,
      })
    } catch (err) {
      dispatch({
        type: 'GET_VIDEO_TEMPLATES_ERROR',
      })
    }
  })
}

const generateVideoMeme = (meme) => (dispatch) => {
  axios.post(`${destination}/video/memes`, meme).then(async (response) => {
    dispatch({
      type: 'GENERATE_VIDEO_MEME',
      payload: response.data,
    })
  })
}

const addNewTemplate = (formData) => (dispatch) => {
  axios
    .post(`${destination}/video/templates`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    .then(async (response) => {
      dispatch({
        type: 'ADD_NEW_TEMPLATE',
        payload: response.data,
      })
    })
}

const setActiveFrame = (index) => (dispatch) => {
  dispatch({
    type: 'SET_ACTIVE_FRAME_VIDEO',
    payload: index,
  })
}

export {
  getVideoTemplates,
  addCaptionToActiveTemplate,
  updateFramesOfActiveTemplate,
  updateCaptions,
  setActiveTemplate,
  generateVideoMeme,
  addNewTemplate,
  setActiveFrame,
}
