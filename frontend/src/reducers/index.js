import { combineReducers } from 'redux'
import canvasElements from './canvasElements'
import focusEditorState from './focusEditorState'
import apiGetter from './apigetter'
import memeReducer from './memeReducer'
import auth from './auth'
import navigation from './navigation'

export default combineReducers({
  canvasElements,
  focusEditorState,
  auth,
  nav: navigation,
  api: apiGetter,
  memeReducer,
})
