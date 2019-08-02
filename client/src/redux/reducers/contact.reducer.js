import { SET_CONTACTS, LOADING_CONTACTS } from "../types";

const initialState = {
  contacts: [],
  isMounted: false,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
        loading: false
      };
    case LOADING_CONTACTS:
      return {
        ...state,
        loading: true
      };
    default:
      return { ...state };
  }
}
