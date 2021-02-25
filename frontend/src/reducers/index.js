import { combineReducers } from 'redux'
import canvasElements from './canvasElements'
import focusEditorState from './focusEditorState'
import apiGetter from './apigetter'
import memeReducer from './memeReducer'
import auth from './auth'
import navigation from './navigation'
import comments from './comments.state'
import meta from './meta.state'

export default combineReducers({
  canvasElements,
  focusEditorState,
  auth,
  comments,
  meta,
  nav: navigation,
  api: apiGetter,
  memeReducer,
})
