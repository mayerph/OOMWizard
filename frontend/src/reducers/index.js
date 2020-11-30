import { combineReducers } from "redux";
import canvasElements from "./canvasElements";
import apiGetter from "./apigetter";

export default combineReducers({
  canvasElements,
  api: apiGetter,
});
