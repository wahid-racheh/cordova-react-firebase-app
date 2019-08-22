import {
  SET_SCREAMS,
  SET_SCREAM,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  LOADING_SCREAMS,
  SET_USER,
  DELETE_SCREAM,
  POST_SCREAM,
  POST_COMMENT
} from "../types";

const initialState = {
  screams: [],
  scream: {},
  isMounted: false,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        screams: state.screams.map(item => {
          if (item.userHandle === action.payload.credentials.handle) {
            item.userImage = action.payload.credentials.imageUrl;
          }
          return item;
        })
      };
    case LOADING_SCREAMS:
      return {
        ...state,
        loading: true
      };
    case SET_SCREAMS:
      return {
        ...state,
        screams: action.payload,
        loading: false
      };
    case SET_SCREAM:
      return {
        ...state,
        scream: action.payload,
        loading: false
      };
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      function isEqual(screamId) {
        return screamId === action.payload.screamId;
      }
      let index = state.screams.findIndex(scream => isEqual(scream.screamId));
      state.screams[index] = action.payload;
      if (isEqual(state.scream.screamId)) {
        state.scream = action.payload;
      }
      return {
        ...state
      };
    case DELETE_SCREAM:
      return {
        ...state,
        screams: state.screams.filter(item => item.screamId !== action.payload)
      };
    case POST_SCREAM:
      return {
        ...state,
        screams: [action.payload, ...state.screams]
      };
    case POST_COMMENT:
      return {
        ...state,
        scream: {
          ...state.scream,
          comments: [action.payload, ...state.scream.comments]
        }
      };
    default:
      return { ...state };
  }
}
