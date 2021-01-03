import { combineReducers } from "redux";
import canvasElements from "./canvasElements";
import focusEditorState from "./focusEditorState";
import apiGetter from "./apigetter";
import memeReducer from "./memeReducer"

export default combineReducers({
  canvasElements,
  focusEditorState,
  api: apiGetter,
  memeReducer
});
