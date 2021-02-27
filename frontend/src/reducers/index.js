import { combineReducers } from 'redux'
import canvasElements from './canvasElements'
import focusEditorState from './focusEditorState'
import apiGetter from './apigetter'
import memeReducer from './memeReducer'
import videoTemplatesReducer from './videoTemplatesReducer'
import auth from './auth'
import navigation from './navigation'
import comments from './comments.state'
import ratings from './rating.state'

export default combineReducers({
  canvasElements,
  focusEditorState,
  auth,
  comments,
  ratings,
  nav: navigation,
  api: apiGetter,
  memeReducer,
  videoTemplatesReducer,
})
