import {
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_MOUNTED,
  SET_UNMOUNTED,
  SET_ADD_ACTION
} from "../types";

import { ADD_SCREAM } from "../../constants";

const initialState = {
  loading: false,
  errors: null,
  isMounted: false,
  addAction: ADD_SCREAM
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: null
      };
    case LOADING_UI:
      return {
        ...state,
        loading: true
      };
    case SET_MOUNTED:
      return {
        ...state,
        isMounted: true
      };
    case SET_UNMOUNTED:
      return {
        ...state,
        isMounted: false
      };
    case SET_ADD_ACTION:
      return {
        ...state,
        addAction: action.payload
      };
    default:
      return { ...state };
  }
}
