import { combineReducers } from 'redux'
import canvasElements from './canvasElements'
import focusEditorState from './focusEditorState'
import apiGetter from './apigetter'
import memeReducer from './memeReducer'
import auth from './auth'
import navigation from './navigation'
import comments from './comments.state'

export default combineReducers({
  canvasElements,
  focusEditorState,
  auth,
  comments,
  nav: navigation,
  api: apiGetter,
  memeReducer,
})
