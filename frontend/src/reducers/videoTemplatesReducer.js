import * as config from '../config.json'

const destination = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`

const DefaultState = {
  action: undefined,
  loading: false,
  data: {
    videoTemplates: [],
    activeTemplate: undefined,
    captions: [],
    activeIndex: undefined,
    meme: undefined,
    activeFrame: undefined,
  },
  error: undefined,
}

const videoTemplatesReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case 'GET_VIDEO_TEMPLATES_SUCCESS':
      const newState = {
        ...state,
        action: 'GET_VIDEO_TEMPLATES_SUCCESS',
        loading: false,
        data: {
          ...state.data,
          videoTemplates: action.payload,
        },
      }
      if (
        !newState.data.activeTemplate &&
        newState.data.videoTemplates.length > 0
      ) {
        newState.data.activeTemplate = { ...newState.data.videoTemplates[0] }
        newState.data.activeTemplate.frames.frames.map((e) => {
          e['captions'] = []
          const newImage = new Image()
          newImage.src = `${destination}${e.route}`
          e['image'] = newImage
          return e
        })
        newState.data.activeIndex = 0
        newState.data.activeFrame = 0
      }
      return newState
    case 'GET_VIDEO_TEMPLATES_ERROR':
      return {
        ...state,
        action: 'GET_VIDEO_TEMPLATES_ERROR',
        loading: false,
        error: 'unable to get a meme',
      }

    case 'GET_VIDEO_TEMPLATES_LOADING':
      return {
        ...state,
        action: 'GET_VIDEO_TEMPLATES_LOADING',
        loading: true,
        error: undefined,
      }
    case 'ADD_CAPTION_TO_VIDEO':
      const newState_ = {
        ...state,
        action: 'ADD_CAPTION_TO_VIDEO',
        loading: false,
        data: {
          ...state.data,

          captions: state.data.captions.concat([action.payload]),
        },
      }
      return newState_

    case 'UPDATE_FRAMES_ACTIVE_TEMPLATE':
      const temp_1 = { ...state }
      temp_1.action = 'UPDATE_FRAMES_ACTIVE_TEMPLATE'
      temp_1.data.activeTemplate.frames.frames = action.payload

      return temp_1
    case 'UPDATE_CAPTIONS':
      const temp_2 = { ...state }
      temp_2.action = 'UPDATE_CAPTIONS'
      temp_2.data.captions = action.payload
      return temp_2
    case 'SET_ACTIVE_TEMPLATE':
      const temp_3 = { ...state }
      temp_3.action = 'SET_ACTIVE_TEMPLATE'
      temp_3.data.activeTemplate = temp_3.data.videoTemplates[action.payload]
      temp_3.data.captions = []
      temp_3.data.activeIndex = action.payload
      // delete captions from old active
      temp_3.data.videoTemplates[action.payload].frames.frames.map((e) => {
        delete e.captions
      })

      // add captions to new one

      temp_3.data.activeTemplate.frames.frames.map((e) => {
        e['captions'] = []
        const newImage = new Image()
        newImage.src = `${destination}${e.route}`
        e['image'] = newImage
        return e
      })

      temp_3.data.meme = undefined
      temp_3.data.activeFrame = 0

      return temp_3
    case 'GENERATE_VIDEO_MEME':
      const temp_4 = { ...state }
      temp_4.action = 'GENERATE_VIDEO_MEME'
      temp_4.data.meme = action.payload

      return temp_4

    case 'ADD_NEW_TEMPLATE':
      const temp_5 = { ...state }
      temp_5.data.videoTemplates.push(action.payload)
      return temp_5

    case 'SET_ACTIVE_FRAME_GIF':
      const temp_6 = { ...state }
      temp_6.data.activeFrame = action.payload
      return temp_6
    default:
      return state
  }
}

export default videoTemplatesReducer
