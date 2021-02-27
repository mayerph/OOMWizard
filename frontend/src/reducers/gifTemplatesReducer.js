import * as config from '../config.json'

const destination = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`

const DefaultState = {
  action: undefined,
  loading: false,
  data: {
    gifTemplates: [],
    activeTemplate: undefined,
    captions: [],
    activeIndex: undefined,
    meme: undefined,
    activeFrame: undefined,
  },
  error: undefined,
}

const gifTemplatesReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case 'GET_GIF_TEMPLATES_SUCCESS':
      console.log('gifffffffff', action.payload)
      const newState = {
        ...state,
        action: 'GET_GIF_TEMPLATES_SUCCESS',
        loading: false,
        data: {
          ...state.data,
          gifTemplates: action.payload,
        },
      }
      if (
        !newState.data.activeTemplate &&
        newState.data.gifTemplates.length > 0
      ) {
        newState.data.activeTemplate = { ...newState.data.gifTemplates[0] }
        console.log('the active one is', newState.data.activeTemplate)
        newState.data.activeTemplate.frames.map((e) => {
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
    case 'GET_GIF_TEMPLATES_ERROR':
      return {
        ...state,
        action: 'GET_GIF_TEMPLATES_ERROR',
        loading: false,
        error: 'unable to get a meme',
      }

    case 'GET_GIF_TEMPLATES_LOADING':
      return {
        ...state,
        action: 'GET_GIF_TEMPLATES_LOADING',
        loading: true,
        error: undefined,
      }

    case 'ADD_CAPTION_TO_GIF':
      const newState_ = {
        ...state,
        action: 'ADD_CAPTION_TO_GIF',
        loading: false,
        data: {
          ...state.data,

          captions: state.data.captions.concat([action.payload]),
        },
      }
      return newState_

    case 'UPDATE_FRAMES_ACTIVE_TEMPLATE_GIF':
      const temp_1 = { ...state }
      temp_1.action = 'UPDATE_FRAMES_ACTIVE_TEMPLATE_GIF'
      temp_1.data.activeTemplate.frames = action.payload

      return temp_1
    case 'UPDATE_CAPTIONS_GIF':
      const temp_2 = { ...state }
      temp_2.action = 'UPDATE_CAPTIONS_GIF'
      temp_2.data.captions = action.payload
      return temp_2
    case 'SET_ACTIVE_TEMPLATE_GIF':
      const temp_3 = { ...state }
      temp_3.action = 'SET_ACTIVE_TEMPLATE_GIF'
      temp_3.data.activeTemplate = temp_3.data.gifTemplates[action.payload]
      temp_3.data.captions = []
      temp_3.data.activeIndex = action.payload
      // delete captions from old active
      temp_3.data.gifTemplates[action.payload].frames.map((e) => {
        delete e.captions
      })

      // add captions to new one

      temp_3.data.activeTemplate.frames.map((e) => {
        e['captions'] = []
        const newImage = new Image()
        newImage.src = `${destination}${e.route}`
        e['image'] = newImage
        return e
      })

      temp_3.data.meme = undefined
      temp_3.data.activeFrame = 0
      return temp_3
    case 'GENERATE_GIF_MEME':
      const temp_4 = { ...state }
      temp_4.action = 'GENERATE_GIF_MEME'
      temp_4.data.meme = action.payload

      return temp_4

    case 'ADD_NEW_TEMPLATE_GIF':
      const temp_5 = { ...state }
      temp_5.data.gifTemplates.push(action.payload)
      temp_5.action = 'ADD_NEW_TEMPLATE_GIF'
      return temp_5
    case 'SET_ACTIVE_FRAME_GIF':
      const temp_6 = { ...state }
      temp_6.data.activeFrame = action.payload
      return temp_6
    default:
      return state
  }
}

export default gifTemplatesReducer
