import { combineReducers } from 'redux'
import canvasElements from './canvasElements'
import focusEditorState from './focusEditorState'
import apiGetter from './apigetter'
import memeReducer from './memeReducer'
import auth from './auth'

export default combineReducers({
  canvasElements,
  focusEditorState,
  auth,
  api: apiGetter,
  memeReducer,
})
