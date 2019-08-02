import {
  SET_SCREAMS,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  LOADING_SCREAMS,
  SET_USER,
  DELETE_SCREAM,
  POST_SCREAM
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
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      let index = state.screams.findIndex(
        scream => scream.screamId === action.payload.screamId
      );
      state.screams[index] = action.payload;
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
    default:
      return { ...state };
  }
}
