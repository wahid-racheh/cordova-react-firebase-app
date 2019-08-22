import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  END_LOADING_USER,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  SET_SELECTED_USER
} from "../types";

const initialState = {
  authenticated: false,
  credentials: {},
  likes: [],
  notifications: [],
  selectedUser: {},

  // This loading is different from UI loading
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        ...state,
        authenticated: true,
        loading: false,
        ...action.payload
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true
      };
    case END_LOADING_USER:
      return {
        ...state,
        loading: false
      };
    case SET_SELECTED_USER:
      return {
        ...state,
        selectedUser: action.payload
      };
    case LIKE_SCREAM:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.handle,
            screamId: action.payload.screamId
          }
        ]
      };
    case UNLIKE_SCREAM:
      return {
        ...state,
        likes: state.likes.filter(
          like => like.screamId !== action.payload.screamId
        )
      };
    default:
      return { ...state };
  }
}
